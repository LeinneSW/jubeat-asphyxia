let updateSelf = false;
let state = {page: 0, contentSize: 20, pageCount: 1};

function setupContainer(container){
    const pageSizeInput = container.querySelector('input.page-size');

    const allPrevBtns = container.querySelectorAll('.pagination-previous');
    const allNextBtns = container.querySelectorAll('.pagination-next');
    const currentPageElements = container.querySelectorAll('.current-page');
    const totalPageElements = container.querySelectorAll('.total-pages');

    state.contentSize = Math.max(+pageSizeInput.value, 1) || 20;

    function updateTablePagination(){
        updateSelf = true;
        const start = state.page * state.contentSize;
        const end = start + state.contentSize;

        const rows = container.querySelectorAll('tr.paginated-content');
        rows.forEach((tr, i) => {
            tr.style.display = (i >= start && i < end) ? '' : 'none';
        });

        state.pageCount = Math.max(Math.ceil(rows.length / state.contentSize), 1);
        currentPageElements.forEach(input => {
            if(input.tagName === 'INPUT'){
                input.value = state.page + 1 + '';
            }else{
                input.textContent = state.page + 1 + '';
            }
        });
        totalPageElements.forEach(s => s.textContent = state.pageCount + '');
        allPrevBtns.forEach(btn => btn.disabled = state.page === 0);
        allNextBtns.forEach(btn => btn.disabled = state.page >= state.pageCount - 1);
    }

    function goToPage(p){
        state.page = Math.min(Math.max(p, 0), state.pageCount - 1);
        updateTablePagination();
    }

    allPrevBtns.forEach(btn => btn.onclick = () => state.page > 0 && goToPage(state.page - 1));
    allNextBtns.forEach(btn => btn.onclick = () => state.page < state.pageCount - 1 && goToPage(state.page + 1));
    currentPageElements.forEach(input => {
        if(input.tagName !== 'INPUT') return;
        input.addEventListener('keydown', (event) => {
            if(event.key !== 'Enter') return;

            event.preventDefault();
            const page = parseInt(input.value);
            if(!isNaN(page) && page > 0 && page <= state.contentSize){
                goToPage(page - 1);
            }else{
                alert(`올바른 숫자를 작성해주세요. (1 ~ ${state.pageCount})`);
                input.value = state.page + 1;
            }
        });
    });
    pageSizeInput.addEventListener('keydown', (event) => {
        if(event.key !== 'Enter') return;

        event.preventDefault();
        const oldSize = state.contentSize;
        const newSize = Math.max(+pageSizeInput.value || 20, 1);
        state.contentSize = newSize;
        state.page = Math.floor(state.page * oldSize / newSize);
        updateTablePagination();
    });

    updateTablePagination();
    const observer = new MutationObserver(() => {
        if(updateSelf){
            updateSelf = false;
            return;
        }
        updateTablePagination();
    });
    observer.observe(container, {childList: true, subtree: true});
}

document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.paginated-container').forEach(setupContainer);
});