// File: js/queue.js
// Purpose: Manages live order queue and notifications.

document.addEventListener('DOMContentLoaded', () => {
    // Mock Database
    const mockOrders = [
        { id: '#2026-001', name: 'Ong Liang Cheng', details: 'Hokkien Mee (No Chili) x2', status: 'Pending' },
        { id: '#2026-002', name: 'Sarah Tan', details: 'Char Kway Teow (S) x1', status: 'Pending' },
        { id: '#2026-003', name: 'Muthu Kumar', details: 'Satay Set A x1', status: 'Accepted' }
    ];

    const queueList = document.getElementById('queue-list');

    // Function to render table rows
    function renderQueue() {
        if (!queueList) return;
        queueList.innerHTML = ''; 

        mockOrders.forEach(order => {
            const row = document.createElement('tr');
            
            let actionContent = '';
            if (order.status === 'Pending') {
                actionContent = `
                    <div class="btn-group">
                        <button class="btn-accept" data-id="${order.id}">Accept</button>
                        <button class="btn-decline" data-id="${order.id}">Decline</button>
                    </div>`;
            } else {
                actionContent = `<span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>`;
            }

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.name}</td>
                <td>${order.details}</td>
                <td>${actionContent}</td>
            `;
            queueList.appendChild(row);
        });
    }

    // Event Delegation for Buttons
    if (queueList) {
        queueList.addEventListener('click', (e) => {
            const target = e.target;
            const id = target.getAttribute('data-id');

            if (target.classList.contains('btn-accept')) {
                processOrder(id, 'Accepted');
            } else if (target.classList.contains('btn-decline')) {
                processOrder(id, 'Declined');
            }
        });
    }

    function processOrder(id, newStatus) {
        const order = mockOrders.find(o => o.id === id);
        if (order) {
            order.status = newStatus;
            renderQueue(); // Re-render table
            updateNotificationCount();
            alert(`Order ${id} has been ${newStatus}`); // Simple notification simulation
        }
    }

    function updateNotificationCount() {
        const badge = document.querySelector('.notif-badge');
        if (badge) {
            let count = parseInt(badge.innerText) || 0;
            badge.innerText = count + 1;
        }
    }

    // Initial Render
    renderQueue();
});