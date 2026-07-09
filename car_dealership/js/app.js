// Global variables
let currentUser = null;
let cars = [];
let selectedCarColor = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    loadCars();
    setupEventListeners();
});

// Check if user is logged in
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateAuthUI();
    }
}

// Update authentication UI
function updateAuthUI() {
    const authLinks = document.getElementById('auth-links');
    const userMenu = document.getElementById('user-menu');
    const usernameDisplay = document.getElementById('username-display');
    
    if (currentUser) {
        authLinks.style.display = 'none';
        userMenu.style.display = 'block';
        usernameDisplay.textContent = `Welcome, ${currentUser.name}`;
    } else {
        authLinks.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };

    // Rental days calculation
    const rentalDaysInput = document.getElementById('rentalDays');
    if (rentalDaysInput) {
        rentalDaysInput.addEventListener('input', calculateRentalCost);
    }
}

// Load cars from the server
async function loadCars() {
    try {
        const response = await fetch('php/get_cars.php');
        const data = await response.json();
        
        if (data.success) {
            cars = data.cars;
            displayCars(cars);
        } else {
            console.error('Failed to load cars:', data.message);
        }
    } catch (error) {
        console.error('Error loading cars:', error);
        // Load demo cars if server is not available
        loadDemoCars();
    }
}

// Load demo cars for testing
function loadDemoCars() {
    cars = [
        {
            id: 1,
            make: 'Toyota',
            model: 'Camry',
            year: 2023,
            price: 50,
            color: 'white',
            image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            description: 'Reliable and fuel-efficient sedan',
            available: true
        },
        {
            id: 2,
            make: 'BMW',
            model: 'X5',
            year: 2023,
            price: 120,
            color: 'black',
            image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            description: 'Luxury SUV with premium features',
            available: true
        },
        {
            id: 3,
            make: 'Mercedes',
            model: 'C-Class',
            year: 2023,
            price: 100,
            color: 'silver',
            image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            description: 'Elegant and sophisticated sedan',
            available: true
        },
        {
            id: 4,
            make: 'Audi',
            model: 'A4',
            year: 2023,
            price: 90,
            color: 'blue',
            image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            description: 'Performance-oriented luxury sedan',
            available: true
        },
        {
            id: 5,
            make: 'Honda',
            model: 'Civic',
            year: 2023,
            price: 40,
            color: 'red',
            image: 'https://images.unsplash.com/photo-1619976215249-e86b07f41623?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            description: 'Compact and economical car',
            available: true
        }
    ];
    displayCars(cars);
}

// Display cars in the grid
function displayCars(carsToShow) {
    const container = document.getElementById('cars-container');
    container.innerHTML = '';

    if (carsToShow.length === 0) {
        container.innerHTML = '<p class="text-center">No cars found matching your criteria.</p>';
        return;
    }

    carsToShow.forEach(car => {
        const carCard = createCarCard(car);
        container.appendChild(carCard);
    });
}

// Create a car card element
function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.dataset.color = car.color;

    const currentColor = selectedCarColor[car.id] || car.color;
    
    card.innerHTML = `
        <img src="${car.image}" alt="${car.make} ${car.model}" class="car-image">
        <div class="car-info">
            <h3>${car.make} ${car.model} (${car.year})</h3>
            <p class="car-price">$${car.price}/day</p>
            <p class="car-details">${car.description}</p>
            <div class="color-selector">
                <label>Color:</label><br>
                <span class="color-option" style="background-color: red" 
                      onclick="changeCarColor(${car.id}, 'red')" 
                      ${currentColor === 'red' ? 'class="color-option selected"' : ''}></span>
                <span class="color-option" style="background-color: blue" 
                      onclick="changeCarColor(${car.id}, 'blue')" 
                      ${currentColor === 'blue' ? 'class="color-option selected"' : ''}></span>
                <span class="color-option" style="background-color: black" 
                      onclick="changeCarColor(${car.id}, 'black')" 
                      ${currentColor === 'black' ? 'class="color-option selected"' : ''}></span>
                <span class="color-option" style="background-color: white; border: 1px solid #ccc" 
                      onclick="changeCarColor(${car.id}, 'white')" 
                      ${currentColor === 'white' ? 'class="color-option selected"' : ''}></span>
                <span class="color-option" style="background-color: silver" 
                      onclick="changeCarColor(${car.id}, 'silver')" 
                      ${currentColor === 'silver' ? 'class="color-option selected"' : ''}></span>
            </div>
            <div class="car-actions">
                <button class="btn" onclick="showCarDetails(${car.id})">View Details</button>
                <button class="btn btn-success" onclick="startRental(${car.id})" 
                        ${!car.available ? 'disabled' : ''}>
                    ${car.available ? 'Rent Now' : 'Unavailable'}
                </button>
            </div>
        </div>
    `;

    return card;
}

// Change car color
function changeCarColor(carId, color) {
    selectedCarColor[carId] = color;
    
    // Update color selection UI
    const carCard = document.querySelector(`[data-color]`);
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Refresh the cars display to show updated color selection
    displayCars(cars);
    
    // Show feedback
    showNotification(`Car color changed to ${color}`, 'success');
}

// Filter cars by color
function filterCars() {
    const colorFilter = document.getElementById('colorFilter').value;
    let filteredCars = cars;

    if (colorFilter) {
        filteredCars = cars.filter(car => {
            const currentColor = selectedCarColor[car.id] || car.color;
            return currentColor === colorFilter;
        });
    }

    displayCars(filteredCars);
}

// Show car details modal
function showCarDetails(carId) {
    const car = cars.find(c => c.id === carId);
    if (!car) return;

    const currentColor = selectedCarColor[carId] || car.color;
    
    const carDetails = document.getElementById('carDetails');
    carDetails.innerHTML = `
        <div class="car-detail-grid">
            <div>
                <img src="${car.image}" alt="${car.make} ${car.model}" class="car-detail-image">
            </div>
            <div class="car-detail-info">
                <h3>${car.make} ${car.model}</h3>
                <div class="car-spec">
                    <span class="spec-label">Year:</span> ${car.year}
                </div>
                <div class="car-spec">
                    <span class="spec-label">Price per day:</span> $${car.price}
                </div>
                <div class="car-spec">
                    <span class="spec-label">Current Color:</span> ${currentColor}
                </div>
                <div class="car-spec">
                    <span class="spec-label">Status:</span> ${car.available ? 'Available' : 'Rented'}
                </div>
                <div class="car-spec">
                    <span class="spec-label">Description:</span> ${car.description}
                </div>
                <div style="margin-top: 1rem;">
                    <button class="btn btn-success" onclick="startRental(${car.id}); closeModal('carModal')" 
                            ${!car.available ? 'disabled' : ''}>
                        ${car.available ? 'Rent This Car' : 'Currently Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('carModal').style.display = 'block';
}

// Start rental process
function startRental(carId) {
    if (!currentUser) {
        showNotification('Please login to rent a car', 'error');
        showLogin();
        return;
    }

    const car = cars.find(c => c.id === carId);
    if (!car || !car.available) {
        showNotification('This car is not available for rent', 'error');
        return;
    }

    document.getElementById('rentalCarId').value = carId;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('rentalStartDate').value = today;
    document.getElementById('rentalStartDate').min = today;
    
    // Reset form
    document.getElementById('rentalDays').value = 1;
    calculateRentalCost();
    
    document.getElementById('rentalModal').style.display = 'block';
}

// Calculate rental cost
function calculateRentalCost() {
    const carId = document.getElementById('rentalCarId').value;
    const days = document.getElementById('rentalDays').value;
    
    if (!carId || !days) return;
    
    const car = cars.find(c => c.id == carId);
    if (!car) return;
    
    const totalCost = car.price * days;
    const tax = totalCost * 0.1; // 10% tax
    const finalCost = totalCost + tax;
    
    document.getElementById('rentalSummary').innerHTML = `
        <h4>Rental Summary</h4>
        <p><strong>Car:</strong> ${car.make} ${car.model}</p>
        <p><strong>Daily Rate:</strong> $${car.price}</p>
        <p><strong>Number of Days:</strong> ${days}</p>
        <p><strong>Subtotal:</strong> $${totalCost.toFixed(2)}</p>
        <p><strong>Tax (10%):</strong> $${tax.toFixed(2)}</p>
        <p><strong>Total Cost:</strong> $${finalCost.toFixed(2)}</p>
    `;
}

// Process car rental
async function rentCar(event) {
    event.preventDefault();
    
    const carId = document.getElementById('rentalCarId').value;
    const days = document.getElementById('rentalDays').value;
    const startDate = document.getElementById('rentalStartDate').value;
    
    const car = cars.find(c => c.id == carId);
    if (!car) return;
    
    const totalCost = car.price * days;
    const tax = totalCost * 0.1;
    const finalCost = totalCost + tax;
    
    const rentalData = {
        carId: carId,
        userId: currentUser.id,
        days: days,
        startDate: startDate,
        totalCost: finalCost
    };
    
    try {
        const response = await fetch('php/rent_car.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rentalData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update car availability
            car.available = false;
            displayCars(cars);
            
            // Close modal
            closeModal('rentalModal');
            
            // Generate and show receipt
            generateReceipt(car, rentalData, result.rentalId);
            
            showNotification('Car rented successfully!', 'success');
        } else {
            showNotification(result.message || 'Failed to rent car', 'error');
        }
    } catch (error) {
        console.error('Error renting car:', error);
        // For demo purposes, still generate receipt
        car.available = false;
        displayCars(cars);
        closeModal('rentalModal');
        generateReceipt(car, rentalData, 'DEMO' + Date.now());
        showNotification('Car rented successfully! (Demo Mode)', 'success');
    }
}

// Generate rental receipt
function generateReceipt(car, rentalData, rentalId) {
    const currentColor = selectedCarColor[car.id] || car.color;
    const totalCost = car.price * rentalData.days;
    const tax = totalCost * 0.1;
    const finalCost = totalCost + tax;
    
    const receiptHTML = `
        <div class="receipt">
            <div class="receipt-header">
                <h2>AutoDealer Rental Receipt</h2>
                <p>Receipt #: ${rentalId}</p>
                <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="receipt-details">
                <div class="receipt-section">
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> ${currentUser.name}</p>
                    <p><strong>Email:</strong> ${currentUser.email}</p>
                    <p><strong>Phone:</strong> ${currentUser.phone}</p>
                </div>
                
                <div class="receipt-section">
                    <h4>Vehicle Information</h4>
                    <p><strong>Make & Model:</strong> ${car.make} ${car.model}</p>
                    <p><strong>Year:</strong> ${car.year}</p>
                    <p><strong>Color:</strong> ${currentColor}</p>
                    <p><strong>Daily Rate:</strong> $${car.price}</p>
                </div>
                
                <div class="receipt-section">
                    <h4>Rental Details</h4>
                    <p><strong>Start Date:</strong> ${rentalData.startDate}</p>
                    <p><strong>Duration:</strong> ${rentalData.days} day(s)</p>
                    <p><strong>End Date:</strong> ${calculateEndDate(rentalData.startDate, rentalData.days)}</p>
                </div>
                
                <div class="receipt-section">
                    <h4>Payment Summary</h4>
                    <p><strong>Subtotal:</strong> $${totalCost.toFixed(2)}</p>
                    <p><strong>Tax (10%):</strong> $${tax.toFixed(2)}</p>
                    <p><strong>Insurance:</strong> $${(rentalData.days * 5).toFixed(2)}</p>
                </div>
            </div>
            
            <div class="receipt-total">
                Total Amount Paid: $${(finalCost + rentalData.days * 5).toFixed(2)}
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn" onclick="printReceipt()">Print Receipt</button>
                <button class="btn" onclick="closeReceipt()">Close</button>
            </div>
        </div>
    `;
    
    // Create receipt modal
    const receiptModal = document.createElement('div');
    receiptModal.id = 'receiptModal';
    receiptModal.className = 'modal';
    receiptModal.style.display = 'block';
    receiptModal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            ${receiptHTML}
        </div>
    `;
    
    document.body.appendChild(receiptModal);
}

// Calculate end date
function calculateEndDate(startDate, days) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + parseInt(days));
    return end.toLocaleDateString();
}

// Print receipt
function printReceipt() {
    const receiptContent = document.querySelector('#receiptModal .receipt').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>AutoDealer Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .receipt { max-width: 600px; margin: 0 auto; }
                .receipt-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 1rem; margin-bottom: 2rem; }
                .receipt-details { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
                .receipt-section { background: #f8f9fa; padding: 1rem; border-radius: 5px; }
                .receipt-section h4 { margin-bottom: 0.5rem; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem; }
                .receipt-total { text-align: center; font-size: 1.5rem; font-weight: bold; padding: 1rem; background: #f8f9fa; border-radius: 5px; margin-top: 2rem; }
            </style>
        </head>
        <body>
            <div class="receipt">${receiptContent}</div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Close receipt
function closeReceipt() {
    const receiptModal = document.getElementById('receiptModal');
    if (receiptModal) {
        receiptModal.remove();
    }
}

// Authentication functions
function showLogin() {
    closeModal('signupModal');
    document.getElementById('loginModal').style.display = 'block';
}

function showSignup() {
    closeModal('loginModal');
    document.getElementById('signupModal').style.display = 'block';
}

async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            closeModal('loginModal');
            showNotification('Login successful!', 'success');
        } else {
            showNotification(result.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        // Demo login for testing
        currentUser = {
            id: 1,
            name: 'Demo User',
            email: email,
            phone: '555-0123'
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal('loginModal');
        showNotification('Login successful! (Demo Mode)', 'success');
    }
}

async function signup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const phone = document.getElementById('signupPhone').value;
    
    try {
        const response = await fetch('php/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, phone })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Account created successfully! Please login.', 'success');
            closeModal('signupModal');
            showLogin();
        } else {
            showNotification(result.message || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        // Demo signup for testing
        showNotification('Account created successfully! (Demo Mode)', 'success');
        closeModal('signupModal');
        showLogin();
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showNotification('Logged out successfully', 'success');
}

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 3000;
        opacity: 0;
        transition: opacity 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#27ae60';
            break;
        case 'error':
            notification.style.backgroundColor = '#e74c3c';
            break;
        default:
            notification.style.backgroundColor = '#3498db';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
