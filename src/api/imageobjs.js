// function to POST a new image to DB
export function postImage (imgJSON) {
    return fetch('https://localhost:7027/api/imageobj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: imgJSON,
    });
}