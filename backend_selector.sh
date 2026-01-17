#!/bin/bash

echo "Choose backend option:"
echo "1. XAMPP (Local Development)"
echo "2. MySQL Direct (Production)"
echo "3. Neon REST (Cloud Production)"
echo "Enter choice (1-3):"
read choice

case $choice in
    1)
        echo "Starting XAMPP backend..."
        cd backend_xampp && php -S localhost:8001
        ;;
    2)
        echo "Starting MySQL Direct backend..."
        cd backend_mysql && php -S localhost:8001
        ;;
    3)
        echo "Starting Neon REST backend..."
        cd backend_neon_rest && php -S localhost:8001
        ;;
    *)
        echo "Invalid choice. Please enter 1, 2, or 3."
        exit 1
        ;;
esac
