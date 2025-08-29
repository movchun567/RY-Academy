async function fetchData() {
    const response = await fetch('https://file.notion.so/f/f/fc1aed7d-0edf-4ccc-8851-423db35cabfe/fbd02ded-9ea5-4ab6-8866-cf4f17b32f18/sales_february_2025.json?table=block&id=25aa2ac6-bc6d-806d-903b-f7d7b46f221d&spaceId=fc1aed7d-0edf-4ccc-8851-423db35cabfe&expirationTimestamp=1756512000000&signature=H-lWgltV6ub3wd1EN9JkDSB7H7e7xRVB_Q0jNrpunIE&downloadName=sales_february_2025.json');
    if (!response.ok) throw new Error('Failed to load JSON file');
    return await response.json();
}

async function renderCharts() {
    const data = await fetchData();
    const salesGrouped = {};
    data.sales.forEach(item => {
        if (!salesGrouped[item.date]) salesGrouped[item.date] = 0;
        salesGrouped[item.date] += item.amount;
    });
    const labels = Object.keys(salesGrouped).sort();
    const amountData = Object.values(salesGrouped);
    new Chart(document.querySelector('.chart1'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Produce Sales',
                data: amountData,
                fill: false,
                borderColor: 'red',
                backgroundColor: 'red',
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: 'white',
                pointBorderColor: 'red',
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Produce Sales - February 2025' }
            },
            scales: { y: { beginAtZero: true } }
        }
    });

    const leadGrouped = {};
    data.sales.forEach(item => {
        if (!leadGrouped[item.date]) leadGrouped[item.date] = 0;
        if (item.isLead) leadGrouped[item.date] += 1;
    });
    const leadData = Object.values(leadGrouped);
    new Chart(document.querySelector('.chart2'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Lead Count',
                data: leadData,
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Lead Count - February 2025' }
            },
            scales: { y: { beginAtZero: true } }
        }
    });

    const customerGrouped = {};
    data.sales.forEach(item => {
        if (!customerGrouped[item.customerId]) customerGrouped[item.customerId] = 0;
        customerGrouped[item.customerId] += 1;
    });

    const customerLabels = Object.keys(customerGrouped).map(id => `Customer ${id}`);
    const customerData = Object.values(customerGrouped);
    const colors = customerLabels.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`);
    new Chart(document.querySelector('.chart3'), {
        type: 'pie',
        data: {
            labels: customerLabels,
            datasets: [{
                label: 'Number of Purchases',
                data: customerData,
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: 'Customer Purchases - February 2025' } }
        }
    });

    const monthGrouped = {};
    data.sales.forEach(item => {
        const month = item.date.slice(0, 7);
        if (!monthGrouped[month]) monthGrouped[month] = 0;
        monthGrouped[month] += item.amount;
    });
    const monthLabels = Object.keys(monthGrouped).sort();
    const monthData = Object.values(monthGrouped);
    new Chart(document.querySelector('.chart4'), {
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Revenue by Month',
                data: monthData,
                fill: false,
                borderColor: 'red',
                backgroundColor: 'red',
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: 'white',
                pointBorderColor: 'red',
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Revenue - February 2025' }
            },
            scales: { y: { beginAtZero: true } }
        }
    });
    const managerGrouped = {};
data.sales.forEach(item => {
    if (!managerGrouped[item.manager]) managerGrouped[item.manager] = 0;
    managerGrouped[item.manager] += item.amount;
});

const managerLabels = Object.keys(managerGrouped);
const managerData = Object.values(managerGrouped);

new Chart(document.querySelector('.chart5'), {
    type: 'radar',
    data: {
        labels: managerLabels,
        datasets: [{
            label: 'Total Sales by Manager',
            data: managerData,
            fill: true,
            backgroundColor: 'rgba(0, 128, 255, 0.2)',
            borderColor: 'rgba(0, 128, 255, 1)',
            pointBackgroundColor: 'rgba(0, 128, 255, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 128, 255, 1)'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: { display: true, text: 'Sales by Manager - February 2025' }
        },
        scales: {
            r: { beginAtZero: true } // radial axis
        }
    }
});
}

renderCharts();

async function renderManagerTable() {
    const data = await fetchData();
    const managerStats = {};
    data.sales.forEach(item => {
        if (!managerStats[item.manager]) {
            managerStats[item.manager] = { orders: 0, revenue: 0 };
        }
        managerStats[item.manager].orders += 1;
        managerStats[item.manager].revenue += item.amount;
    });
    const tableContainer = document.querySelector('.manager-table');
    tableContainer.innerHTML = '';
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.textAlign = 'left';
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th style="border: 1px solid #000; padding: 4px;">Manager</th>
            <th style="border: 1px solid #000; padding: 4px;">Orders</th>
            <th style="border: 1px solid #000; padding: 4px;">Revenue</th>
            <th style="border: 1px solid #000; padding: 4px;">Avg Check</th>
        </tr>
    `;
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    Object.entries(managerStats).forEach(([manager, stats]) => {
        const avgCheck = (stats.revenue / stats.orders).toFixed(2);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="border: 1px solid #000; padding: 4px;">${manager}</td>
            <td style="border: 1px solid #000; padding: 4px;">${stats.orders}</td>
            <td style="border: 1px solid #000; padding: 4px;">${stats.revenue}</td>
            <td style="border: 1px solid #000; padding: 4px;">${avgCheck}</td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

renderManagerTable();

async function renderProductTable() {
    const data = await fetchData();
    const productStats = {};
    data.sales.forEach(item => {
        if (!productStats[item.product]) {
            productStats[item.product] = { units: 0, revenue: 0 };
        }
        productStats[item.product].units += 1;
        productStats[item.product].revenue += item.amount;
    });
    const sortedProducts = Object.entries(productStats)
        .map(([product, stats]) => ({ product, ...stats }))
        .sort((a, b) => a.revenue - b.revenue);
    const tableContainer = document.querySelector('.product-table');
    tableContainer.innerHTML = '';
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.textAlign = 'left';
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th style="border: 1px solid #000; padding: 4px;">Product</th>
            <th style="border: 1px solid #000; padding: 4px;">Units</th>
            <th style="border: 1px solid #000; padding: 4px;">Revenue</th>
            <th style="border: 1px solid #000; padding: 4px;">Turnover</th>
        </tr>
    `;
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    sortedProducts.forEach(item => {
        const turnover = item.revenue;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="border: 1px solid #000; padding: 4px;">${item.product}</td>
            <td style="border: 1px solid #000; padding: 4px;">${item.units}</td>
            <td style="border: 1px solid #000; padding: 4px;">${item.revenue}</td>
            <td style="border: 1px solid #000; padding: 4px;">${turnover}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

renderProductTable();