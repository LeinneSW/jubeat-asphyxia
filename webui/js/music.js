document.addEventListener('DOMContentLoaded', function(){
    fetch('static/resources/music_info.json').then(async r => {
        const musicData = await r.json();
        musicData && document.querySelectorAll('tr.paginated-content').forEach(tr => {
            const id = tr.getAttribute('data-music-id');
            const name = musicData[id]?.name || `알 수 없음(${id})`;
            const el = tr.querySelector('.song-name');
            if(el) el.textContent = name;
        });
    })
});