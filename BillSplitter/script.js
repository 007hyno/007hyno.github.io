document.addEventListener('DOMContentLoaded', function() {
    const peopleContainer = document.getElementById('people-container');
    const addPersonBtn = document.getElementById('addPersonBtn');
    const newPersonNameInput = document.getElementById('newPersonName');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('resultsSection');
    const resultsText = document.getElementById('resultsText');
    const copyBtn = document.getElementById('copyBtn');
    const extraCostInput = document.getElementById('extraCost');
    
    let personCount = 0;
    
    // Add initial persons
    // addPerson('Person 1');
    // addPerson('Person 2');
    addPerson('');
    addPerson('');
    
    // Add Person Event
    addPersonBtn.addEventListener('click', function() {
        const name = newPersonNameInput.value.trim();
        if (name) {
            addPerson(name);
            newPersonNameInput.value = '';
        } else {
            alert('Please enter a name');
        }
    });
    
    // Calculate Split Event
    calculateBtn.addEventListener('click', calculateSplit);
    
    // Copy Results Event
    copyBtn.addEventListener('click', function() {
        const range = document.createRange();
        range.selectNode(resultsText);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        
        this.textContent = 'Copied!';
        setTimeout(() => {
            this.textContent = 'Copy Results';
        }, 2000);
    });
    
    function addPerson(name) {
        personCount++;
        const personId = `person-${personCount}`;
        
        const personCard = document.createElement('div');
        personCard.className = 'person-card';
        personCard.id = personId;
        
        personCard.innerHTML = `
            <div class="nameinput">
                <input type="text" placeholder="Person Name" class="person-name" value=${name}>
            </div>
            
            <button class="remove-person" data-id="${personId}">×</button>
            <ul class="item-list" id="${personId}-items">
                <li class="item-entry">
                    <span class="item-number">1.</span>
                    <div class="item-name">
                        <input type="text" placeholder="Item name">
                    </div>
                    <div class="item-price">
                        <input type="number" placeholder="0.00" step="0.01" min="0">
                    </div>
                    <button class="remove-item">×</button>
                </li>
                <li class="item-entry">
                    <span class="item-number">2.</span>
                    <div class="item-name">
                        <input type="text" placeholder="Item name">
                    </div>
                    <div class="item-price">
                        <input type="number" placeholder="0.00" step="0.01" min="0">
                    </div>
                    <button class="remove-item">×</button>
                </li>
            </ul>
            <button class="add-item-btn addButton" data-id="${personId}">+ Add Item</button>
            <div class="person-total" id="${personId}-total">Total: $0.00</div>
        `;
        
        peopleContainer.appendChild(personCard);
        
        // Add Item Event
        personCard.querySelector('.add-item-btn').addEventListener('click', function() {
            const personId = this.getAttribute('data-id');
            addItemToList(personId);
            updatePersonTotal(personId);
        });
        
        // Remove Person Event
        personCard.querySelector('.remove-person').addEventListener('click', function() {
            const personId = this.getAttribute('data-id');
            document.getElementById(personId).remove();
        });
        
        // Remove Item Events
        personCard.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemEntry = this.closest('.item-entry');
                const personId = itemEntry.closest('.person-card').id;
                itemEntry.remove();
                renumberItems(personId);
                updatePersonTotal(personId);
            });
        });
        
        // Price Change Events
        personCard.querySelectorAll('.item-price input').forEach(input => {
            input.addEventListener('input', function() {
                const personId = this.closest('.person-card').id;
                updatePersonTotal(personId);
            });
        });
    }
    
    function addItemToList(personId) {
        const itemsList = document.getElementById(`${personId}-items`);
        const itemCount = itemsList.children.length + 1;
        
        const newItem = document.createElement('li');
        newItem.className = 'item-entry';
        
        newItem.innerHTML = `
            <span class="item-number">${itemCount}.</span>
            <div class="item-name">
                <input type="text" placeholder="Item name">
            </div>
            <div class="item-price">
                <input type="number" placeholder="0.00" step="0.01" min="0">
            </div>
            <button class="remove-item">×</button>
        `;
        
        itemsList.appendChild(newItem);
        
        // Add Remove Item Event to new item
        newItem.querySelector('.remove-item').addEventListener('click', function() {
            const itemEntry = this.closest('.item-entry');
            const personId = itemEntry.closest('.person-card').id;
            itemEntry.remove();
            renumberItems(personId);
            updatePersonTotal(personId);
        });
        
        // Add Price Change Event to new item
        newItem.querySelector('.item-price input').addEventListener('input', function() {
            const personId = this.closest('.person-card').id;
            updatePersonTotal(personId);
        });
        
        // Focus on the new item's name input
        newItem.querySelector('.item-name input').focus();
    }
    
    function renumberItems(personId) {
        const itemsList = document.getElementById(`${personId}-items`);
        const items = itemsList.querySelectorAll('.item-entry');
        
        items.forEach((item, index) => {
            item.querySelector('.item-number').textContent = `${index + 1}.`;
        });
    }
    
    function updatePersonTotal(personId) {
        const itemsList = document.getElementById(`${personId}-items`);
        const priceInputs = itemsList.querySelectorAll('.item-price input');
        let total = 0;
        
        priceInputs.forEach(input => {
            const price = parseFloat(input.value) || 0;
            total += price;
        });
        
        document.getElementById(`${personId}-total`).textContent = `Total: $${total.toFixed(2)}`;
    }
    
    function calculateSplit() {
        const personCards = document.querySelectorAll('.person-card');
        const extraCost = parseFloat(extraCostInput.value) || 0;
        
        if (personCards.length === 0) {
            alert('Please add at least one person');
            return;
        }
        
        const peopleData = [];
        let grandTotal = 0;
        
        // Collect all person data
        personCards.forEach(card => {
            const personId = card.id;
            let name = card.querySelector('.person-name').value;
            const items = [];
            let personTotal = 0;
            
            const itemEntries = card.querySelectorAll('.item-entry');
            itemEntries.forEach(itemEntry => {
                let itemName = itemEntry.querySelector('.item-name input').value.trim();
                const itemPrice = parseFloat(itemEntry.querySelector('.item-price input').value) || 0;
                
                name = (name === '') ? 'Person' : name;
                itemName = (itemName === '') ? 'Item' : itemName;
                if (itemName && itemPrice > 0) {
                    items.push({
                        name: itemName,
                        price: itemPrice
                    });
                    personTotal += itemPrice;
                }
            });
            
            grandTotal += personTotal;
            
            peopleData.push({
                id: personId,
                name: name,
                items: items,
                subtotal: personTotal,
                extraCost: 0, // Will calculate after
                total: 0 // Will calculate after
            });
        });
        
        // Calculate extra costs based on proportion
        if (extraCost > 0 && grandTotal > 0) {
            peopleData.forEach(person => {
                const proportion = person.subtotal / grandTotal;
                person.extraCost = extraCost * proportion;
                person.total = person.subtotal + person.extraCost;
            });
        } else {
            peopleData.forEach(person => {
                person.total = person.subtotal;
            });
        }
        
        // Generate results text
        let results = '';
        
        peopleData.forEach(person => {
            results += `${person.name}'s Bill:\n`;
            
            person.items.forEach((item, index) => {
                results += `${index + 1}. ${item.name}: $${item.price.toFixed(2)}\n`;
            });
            
            if (person.extraCost > 0) {
                results += `${person.items.length + 1}. Extra costs: $${person.extraCost.toFixed(2)}\n`;
            }
            
            results += `Total: $${person.total.toFixed(2)}\n\n`;
        });
        
        // Display results
        resultsText.textContent = results;
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
});