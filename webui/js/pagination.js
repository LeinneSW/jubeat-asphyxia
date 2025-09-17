function setupContainer(container){
    const pageSizeInput = container.querySelector('input.page-size');
    const controls = container.querySelectorAll('.pagination-controls');
    const rows = Array.from(container.querySelectorAll('tr.paginated-content'));

    const allPrevBtns = container.querySelectorAll('.pagination-previous');
    const allNextBtns = container.querySelectorAll('.pagination-next');
    const currentPageElements = container.querySelectorAll('.current-page');
    const totalPagesSpans = container.querySelectorAll('.total-pages');

    let state = {page: 0, pageSize: Math.max(+pageSizeInput.value || 20, 1), pageCount: 1};

    function applyVisibility(){
        const start = state.page * state.pageSize;
        const end = start + state.pageSize;
        rows.forEach((tr, i) => {
            tr.style.display = (i >= start && i < end) ? '' : 'none';
        });
    }

    function updateControls() {
        state.pageCount = Math.max(Math.ceil(rows.length / state.pageSize), 1);

        controls.forEach(control => {
            control.style.display = state.pageCount > 1 ? 'flex' : 'none';
        });

        debugger
        currentPageElements.forEach(input => {
            if(input.tagName === 'INPUT'){
                input.value = state.page + 1;
            }else{
                input.textContent = state.page + 1;
            }
        });
        totalPagesSpans.forEach(s => s.textContent = state.pageCount);

        allPrevBtns.forEach(btn => btn.disabled = state.page === 0);
        allNextBtns.forEach(btn => btn.disabled = state.page >= state.pageCount - 1);
    }

    function goToPage(p){
        state.page = Math.min(Math.max(p, 0), state.pageCount - 1);
        applyVisibility();
        updateControls();
    }

    function refreshAll(){
        state.pageCount = Math.max(Math.ceil(rows.length / state.pageSize), 1);
        state.page = Math.min(Math.max(0, state.page), state.pageCount - 1);
        applyVisibility();
        updateControls();
    }

    allPrevBtns.forEach(btn => {
        btn.onclick = () => { if (state.page > 0) goToPage(state.page - 1); };
    });
    allNextBtns.forEach(btn => {
        btn.onclick = () => { if (state.page < state.pageCount - 1) goToPage(state.page + 1); };
    });

    // 초기화
    refreshAll();

    currentPageElements.forEach(input => {
        if(input.tagName !== 'INPUT') return;
        input.addEventListener('keydown', (event) => {
            if(event.key !== 'Enter') return;

            event.preventDefault();
            const page = parseInt(input.value);
            if(!isNaN(page) && page > 0 && page <= state.pageSize){
                goToPage(page - 1);
            }else{
                alert(`올바른 숫자를 작성해주세요. (1 ~ ${state.pageCount})`);
                input.value = state.page + 1;
            }
        });
    });

    // 페이지당 개수 변경
    pageSizeInput.addEventListener('keydown', (event) => {
        if(event.key !== 'Enter') return;

        event.preventDefault();
        const oldSize = state.pageSize;
        const newSize = Math.max(+pageSizeInput.value || 20, 1);
        state.pageSize = newSize;
        state.page = Math.floor(state.page * oldSize / newSize);
        refreshAll();
    });
}

document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.paginated-container').forEach(setupContainer);
});