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

async function copyEndpoint(path) {
    const fullUrl = `${API_BASE_URL}${path}`;
    
    try {
        await navigator.clipboard.writeText(fullUrl);
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '¡Copiado!';
        button.style.background = 'var(--success)';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    } catch (error) {
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = '¡Copiado!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } catch (err) {
            alert('Error al copiar URL. Por favor copia manualmente: ' + fullUrl);
        }
        
        document.body.removeChild(textArea);
    }
}
