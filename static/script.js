document.addEventListener("DOMContentLoaded", function() {
    // Fetch and display tracked websites in the Tracker section
    fetch('/getTrackedWebsites')
        .then(response => response.json())
        .then(data => {
            const websiteList = document.getElementById('website-list');
            websiteList.innerHTML = ''; // Clear the list before adding new items
            if (data.length === 0) {
                const noDataMessage = document.createElement('li');
                noDataMessage.textContent = 'No websites tracked yet.';
                websiteList.appendChild(noDataMessage);
            } else {
                data.forEach(website => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = website;
                    link.textContent = website;
                    link.target = '_blank';
                    listItem.appendChild(link);
                    websiteList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching tracked websites:', error);
        });

    // Fetch and display target URLs in the Target section
    fetch('/getTargets')
        .then(response => response.json())
        .then(data => {
            const targetList = document.getElementById('target-list');
            targetList.innerHTML = ''; // Clear the list before adding new items
            if (data.length === 0) {
                const noDataMessage = document.createElement('li');
                noDataMessage.textContent = 'No targets added yet.';
                targetList.appendChild(noDataMessage);
            } else {
                data.forEach(target => {
                    const listItem = document.createElement('li');
                    listItem.textContent = target;
                    targetList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching target URLs:', error);
        });

    // Handle form submission for adding target URLs
    document.getElementById('target-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const url = document.getElementById('target-url').value;
        fetch('/addTarget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        })
        .then(response => response.json())
        .then(() => {
            document.getElementById('target-url').value = ''; // Clear the input field
            // Update the target list
            fetch('/getTargets')
                .then(response => response.json())
                .then(data => {
                    const targetList = document.getElementById('target-list');
                    targetList.innerHTML = ''; // Clear the list before adding new items
                    if (data.length === 0) {
                        const noDataMessage = document.createElement('li');
                        noDataMessage.textContent = 'No targets added yet.';
                        targetList.appendChild(noDataMessage);
                    } else {
                        data.forEach(target => {
                            const listItem = document.createElement('li');
                            listItem.textContent = target;
                            targetList.appendChild(listItem);
                        });
                    }
                });
        })
        .catch(error => {
            console.error('Error adding target:', error);
        });
    });

    // Handle form submission for adding block URLs
    document.getElementById('block-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const url = document.getElementById('block-url').value;
        fetch('/addBlock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        })
        .then(response => response.json())
        .then(() => {
            document.getElementById('block-url').value = ''; // Clear the input field
            // Update the block list
            fetch('/getBlocks')
                .then(response => response.json())
                .then(data => {
                    const blockList = document.getElementById('block-list');
                    blockList.innerHTML = ''; // Clear the list before adding new items
                    if (data.length === 0) {
                        const noDataMessage = document.createElement('li');
                        noDataMessage.textContent = 'No blocks added yet.';
                        blockList.appendChild(noDataMessage);
                    } else {
                        data.forEach(block => {
                            const listItem = document.createElement('li');
                            listItem.textContent = block;
                            blockList.appendChild(listItem);
                        });
                    }
                });
        })
        .catch(error => {
            console.error('Error adding block:', error);
        });
    });
});
