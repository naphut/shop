
import React, { useState, useEffect, useMemo } from 'react';
import { Language, Currency, ViewState, AdminViewState, CartItem, Product, ThemeColor, UserAccount, Order, OrderStatus, HeroVariant } from './types';
import { TRANSLATIONS, THEMES } from './constants';
import { apiService } from './services/apiService';
import { smartSearchProducts } from './services/geminiService';

// Storefront Components
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import CartSheet from './components/CartSheet';
import Checkout from './components/Checkout';
import SearchOverlay from './components/SearchOverlay';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import OrderTracking from './components/OrderTracking';
import FlashSale from './components/FlashSale';
import HeroSlider from './components/HeroSlider';
import AccountView from './components/AccountView';
import HomeProductSection from './components/HomeProductSection';
import FilterSidebar from './components/FilterSidebar';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardView from './components/admin/AdminDashboardView';
import AdminProductsView from './components/admin/AdminProductsView';
import AdminOrdersView from './components/admin/AdminOrdersView';
import AdminLoginView from './components/admin/AdminLoginView';

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(() => window.location.pathname.startsWith('/admin'));
  const [lang, setLang] = useState<Language>(Language.EN);
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [view, setView] = useState<ViewState>('home');
  const [heroVariant, setHeroVariant] = useState<HeroVariant>('luxury');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ms-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('ms-wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ids: string[], message?: string} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [theme, setTheme] = useState<ThemeColor>((localStorage.getItem('ms-theme-pref') as ThemeColor) || 'black');

  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminView, setAdminView] = useState<AdminViewState>('dashboard');

  // --- Data Sync ---
  useEffect(() => {
    const initApp = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Starting app initialization...');
            
            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Initialization timeout')), 10000);
            });
            
            // 1. Sync User Session
            const token = localStorage.getItem('ms-token');
            if (token) {
                try {
                    console.log('Found token, validating...');
                    const res = await apiService.getMe();
                    setCurrentUser(res.data);
                    if (res.data.role === 'admin') setIsAdminLoggedIn(true);
                    console.log('User session restored:', res.data);
                } catch (err) {
                    console.log('Token validation failed:', err);
                    localStorage.removeItem('ms-token');
                }
            }

            // 2. Fetch Products with timeout
            try {
                console.log('Fetching products...');
                const res = await Promise.race([
                    apiService.getProducts(),
                    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('API timeout')), 5000)
                ]
                );
                
                console.log('Products API response:', res);
                
                // Handle the response structure from backend
                const productsData = res.data.data || res.data;
                console.log('Products data:', productsData);
                
                if (!Array.isArray(productsData)) {
                    throw new Error('Products data is not an array');
                }
                
                // In a real DB, name_json is a string that needs parsing
                const formatted = productsData.map((p: any) => {
                    try {
                        return {
                            ...p,
                            name: typeof p.name_json === 'string' ? JSON.parse(p.name_json) : p.name_json,
                            description: typeof p.description_json === 'string' ? JSON.parse(p.description_json) : p.description_json,
                            price: parseFloat(p.price)
                        };
                    } catch (parseErr) {
                        console.error('Error parsing product:', p.id, parseErr);
                        return {
                            ...p,
                            name: { en: p.name || 'Product', kh: '' },
                            description: { en: p.description || '', kh: '' },
                            price: parseFloat(p.price) || 0
                        };
                    }
                });
                setProducts(formatted);
                console.log('Products loaded successfully:', formatted.length);
                
            } catch (err) {
                console.error("Catalog Sync Error:", err);
                console.error("Error details:", err.response?.data || err.message);
                setError("Failed to load products. Please try again.");
            }
            
        } catch (err) {
            console.error("App initialization error:", err);
            setError(err.message || "Failed to initialize application.");
        } finally {
            setLoading(false);
            console.log('App initialization completed');
        }
    };
    initApp();
  }, []);

  useEffect(() => localStorage.setItem('ms-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('ms-wishlist', JSON.stringify(wishlist)), [wishlist]);

  const handleLogin = async (credentials: any) => {
    try {
        const res = await apiService.login(credentials);
        localStorage.setItem('ms-token', res.data.token);
        setCurrentUser(res.data.user);
        if (res.data.user.role === 'admin') {
            setIsAdminLoggedIn(true);
            setIsAdminMode(true);
        }
        setView('home');
    } catch (err) {
        alert("Authentication Failed: Terminal Rejected Credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ms-token');
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    setIsAdminMode(false);
    setView('home');
  };

  const formatPrice = (usdPrice: number) => {
    const rates: Record<Currency, number> = { [Currency.USD]: 1, [Currency.KHR]: 4100, [Currency.CNY]: 7.2 };
    const converted = usdPrice * rates[currency];
    const symbol = currency === Currency.USD ? '$' : currency === Currency.KHR ? '៛' : '¥';
    return `${symbol} ${converted.toLocaleString()}`;
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesDept = selectedDept === 'All' || p.category === selectedDept;
      const matchesCat = selectedCat === 'All' || p.subCategory === selectedCat;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesDept && matchesCat && matchesPrice;
    });
  }, [products, selectedDept, selectedCat, priceRange]);

  // --- ADMIN ROUTING ---
  if (isAdminMode && isAdminLoggedIn) {
    return (
      <AdminLayout activeView={adminView} onViewChange={setAdminView} onLogout={handleLogout}>
        {adminView === 'dashboard' && <AdminDashboardView products={products} orders={[]} users={[]} />}
        {adminView === 'products' && (
          <AdminProductsView products={products} 
            onUpdate={(id, act) => setProducts(p => p.map(pr => pr.id === id ? {...pr, isActive: act} : pr))}
            onDelete={id => setProducts(p => p.filter(pr => pr.id !== id))}
          />
        )}
        {adminView === 'orders' && <AdminOrdersView orders={[]} onUpdateStatus={(id, s) => {}} />}
      </AdminLayout>
    );
  } else if (isAdminMode && !isAdminLoggedIn) {
    return <AdminLoginView onLogin={(pass) => handleLogin({email: 'admin@master.com', password: pass})} onCancel={() => setIsAdminMode(false)} />;
  }

  // --- LOADING AND ERROR STATES ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Master Shirt Shop...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --- USER ROUTING ---
  return (
    <div className={`min-h-screen transition-colors duration-700 ${THEMES[theme].bgLight}`}>
      <Navbar 
        lang={lang} setLang={setLang} setCurrency={setCurrency}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length} onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setView('wishlist')}
        setView={setView} 
        setSelectedCategory={(cat) => { setSelectedDept(cat); setView('home'); }}
        currentView={view} theme={theme} setTheme={setTheme}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
        onSearch={async (q) => {
          setIsSearching(true);
          setIsSearchOpen(true);
          const results = await smartSearchProducts(q, lang);
          setSearchResults({ ids: results.matchedIds, message: results.message });
          setIsSearching(false);
        }}
        isLoggedIn={!!currentUser}
        onAdminClick={() => setIsAdminMode(true)}
      />

      <main className="pb-24">
        {selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} lang={lang} formatPrice={formatPrice} 
            onAddToCart={(p,c,s,q) => {
              setCart(prev => [...prev, { product: p, quantity: q, selectedColor: c, selectedSize: s }]);
              setIsCartOpen(true);
            }} 
            onClose={() => setSelectedProduct(null)} 
            wishlist={wishlist} onToggleWishlist={id => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          />
        ) : (
          <>
            {view === 'home' && (
              <>
                <HeroSlider lang={lang} theme={theme} setView={setView} variant={heroVariant} />
                <div className="container mx-auto px-6 py-24 flex flex-col lg:flex-row gap-12">
                   <FilterSidebar 
                     products={products} selectedDept={selectedDept} selectedCat={selectedCat}
                     selectedItemType="All" selectedBrands={[]} selectedSizes={[]} selectedColors={[]}
                     selectedMaterials={[]} priceRange={priceRange} minRating={0} selectedOthers={[]}
                     setSelectedDept={setSelectedDept} setSelectedCat={setSelectedCat} setSelectedItemType={()=>{}}
                     toggleBrand={()=>{}} toggleSize={()=>{}} toggleColor={()=>{}} toggleMaterial={()=>{}}
                     setPriceRange={setPriceRange} setMinRating={()=>{}} toggleOther={()=>{}} clearFilters={()=>{}}
                   />
                   <div className="flex-1">
                      <HomeProductSection 
                        title="Neural Selection." featuredProducts={products.filter(p => p.isBestSeller)} 
                        moreProducts={filteredProducts} lang={lang} formatPrice={formatPrice} 
                        onAddToCart={(p,c,s,q) => {
                          setCart(prev => [...prev, { product: p, quantity: q, selectedColor: c, selectedSize: s }]);
                          setIsCartOpen(true);
                        }} 
                        onQuickView={setSelectedProduct} wishlist={wishlist} 
                        onToggleWishlist={id => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} 
                        cart={cart}
                      />
                   </div>
                </div>
              </>
            )}
            {view === 'account' && (
                <AccountView 
                    lang={lang} isLoggedIn={!!currentUser} currentUser={currentUser} 
                    onLogin={(email) => handleLogin({email, password: 'password'})} 
                    onLogout={handleLogout} orders={[]} 
                />
            )}
            {view === 'checkout' && (
              <Checkout 
                lang={lang} cart={cart} formatPrice={formatPrice} 
                onSuccess={async (data) => {
                   try {
                     await apiService.placeOrder({ ...data, items: cart, total: cart.reduce((a,b) => a+(b.product.price*b.quantity), 0) });
                     setCart([]);
                     setView('tracking');
                     alert('Order Secured in Mainframe');
                   } catch(e) { alert("Data Logging Failed"); }
                }} 
              />
            )}
            {view === 'tracking' && <OrderTracking lang={lang} />}
          </>
        )}
      </main>

      <Footer lang={lang} />
      <CartSheet 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} 
        cart={cart} setCart={setCart} lang={lang} formatPrice={formatPrice} 
        onCheckout={() => { setIsCartOpen(false); setView('checkout'); }} 
      />
    </div>
  );
};

export default App;
