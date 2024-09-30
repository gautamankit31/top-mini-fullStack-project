const userUrl = document.getElementById('user-url');
const shortenBtn = document.getElementById('shorten-url');
const shortenedUrlDiv = document.getElementById('shortened-url');

async function fetchShortUrl() {
    const longUrl = userUrl.value.trim();

    if (!longUrl) {
        shortenedUrlDiv.innerHTML = 'Please enter a valid URL';
        return;
    }

    try {
        console.log("Long URL:", longUrl);
        const res = await fetch('https://url-shortner-ecdj.onrender.com/shorturl', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ longUrl })
        });

        if (!res.ok) {
            throw new Error('Failed to shorten URL');
        }

        const shortenedUrl = await res.json();

        // Update the shortened URL display
        shortenedUrlDiv.innerHTML = `<p class="text-lg font-semibold text-gray-700 mb-2">Shortened URL:</p> 
                                     <a href="https://url-shortner-ecdj.onrender.com/${shortenedUrl.shortUrl}" target="_blank" 
                                     class="text-blue-500 hover:underline break-all">
                                     https://url-shortner-ecdj.onrender.com/${shortenedUrl.shortUrl}
                                     </a>`;
    } catch (error) {
        console.error('Error:', error);
        shortenedUrlDiv.innerHTML = 'Error: Unable to shorten URL';
    }
}

shortenBtn.addEventListener('click', fetchShortUrl);
