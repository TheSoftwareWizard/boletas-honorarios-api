const API_BASE_URL = window.location.origin || 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const baseUrlElement = document.getElementById('base-url');
    if (baseUrlElement) {
        baseUrlElement.textContent = API_BASE_URL;
    }
});

async function testEndpoint(endpointType) {
    const endpoints = {
        retention: '/v1/retention',
        history: '/v1/retention/history',
        health: '/health'
    };

    const endpoint = endpoints[endpointType];
    if (!endpoint) {
        console.error('Unknown endpoint type:', endpointType);
        return;
    }

    const responseSection = document.getElementById(`response-${endpointType}`);
    const jsonElement = document.getElementById(`json-${endpointType}`);

    if (!responseSection || !jsonElement) {
        console.error('Response elements not found for:', endpointType);
        return;
    }

    responseSection.style.display = 'block';
    jsonElement.textContent = 'Cargando...';
    jsonElement.className = 'response-json loading';

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        const data = await response.json();
        jsonElement.textContent = JSON.stringify(data, null, 2);
        jsonElement.className = response.ok ? 'response-json' : 'response-json error';
    } catch (error) {
        jsonElement.textContent = JSON.stringify({
            error: {
                code: 'NETWORK_ERROR',
                message: error.message || 'Failed to fetch data from API',
                timestamp: new Date().toISOString()
            }
        }, null, 2);
        jsonElement.className = 'response-json error';
    }
}

async function copyEndpoint(path, buttonElement) {
    const fullUrl = `${API_BASE_URL}${path}`;
    const button = buttonElement || (window.event && window.event.target);
    if (!button) return;
    
    const originalText = button.textContent;
    
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(fullUrl);
            button.textContent = '¡Copiado!';
            button.style.background = 'var(--success)';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        } else {
            throw new Error('Clipboard API not available');
        }
    } catch (error) {
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, fullUrl.length);
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                button.textContent = '¡Copiado!';
                button.style.background = 'var(--success)';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 2000);
            } else {
                throw new Error('execCommand failed');
            }
        } catch (err) {
            button.textContent = 'Error';
            button.style.background = 'var(--error)';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }
        
        document.body.removeChild(textArea);
    }
}
