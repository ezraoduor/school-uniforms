// Simple interactivity
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                alert('Navigating to ' + card.querySelector('.category-title').textContent + ' category');
            });
        });

        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productName = card.querySelector('.product-name').textContent;
                alert('Viewing product: ' + productName);
            });
        });

        // Search functionality
        document.querySelector('.search-btn').addEventListener('click', () => {
            const searchTerm = document.querySelector('.search-box').value;
            if (searchTerm.trim()) {
                alert('Searching for: ' + searchTerm);
            } else {
                alert('Please enter a search term');
            }
        });

        // Basket functionality
        let basketCount = 0;
        document.querySelector('.basket-btn').addEventListener('click', () => {
            alert('Basket is empty. Add some products!');
        });

        // Add to basket simulation
        document.querySelectorAll('.product-card').forEach(card => {
            const addToBasketBtn = document.createElement('button');
            addToBasketBtn.textContent = 'Add to Basket';
            addToBasketBtn.style.cssText = `
                background: #2196F3;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                margin-top: 10px;
                transition: all 0.3s ease;
            `;
            
            addToBasketBtn.addEventListener('mouseenter', () => {
                addToBasketBtn.style.background = '#1976D2';
            });
            
            addToBasketBtn.addEventListener('mouseleave', () => {
                addToBasketBtn.style.background = '#2196F3';
            });
            
            addToBasketBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                basketCount++;
                document.querySelector('.basket-btn span').textContent = basketCount;
                addToBasketBtn.textContent = 'Added!';
                addToBasketBtn.style.background = '#4CAF50';
                
                setTimeout(() => {
                    addToBasketBtn.textContent = 'Add to Basket';
                    addToBasketBtn.style.background = '#2196F3';
                }, 2000);
            });
            
            card.querySelector('.product-info').appendChild(addToBasketBtn);
        });

        // Mobile menu toggle (simplified)
        if (window.innerWidth <= 768) {
            document.querySelector('.nav-items').style.display = 'flex';
            document.querySelector('.nav-items').style.flexWrap = 'wrap';
            document.querySelector('.nav-items').style.justifyContent = 'center';
        }