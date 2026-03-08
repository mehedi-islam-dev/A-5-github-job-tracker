const issuesContainer = document.getElementById('issues-container');
const loadingSpinner = document.getElementById('loading-spinner');
const issueCountElement = document.getElementById('issue-count');


let allIssues = [];
async function fetchIssues() {
    try {
        loadingSpinner.classList.remove('hidden');
        issuesContainer.classList.add('hidden');
        const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await response.json();
        allIssues = data.data || data; 
        renderIssues(allIssues);

    } catch (error) {
        console.error("Error fetching issues:", error);
        issuesContainer.innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load issues. Please try again later.</p>`;
    } finally {
        loadingSpinner.classList.add('hidden');
        issuesContainer.classList.remove('hidden');
    }
}

function renderIssues(issuesToRender) {
    issueCountElement.innerText = issuesToRender.length;
    
    issuesContainer.innerHTML = '';

    if (issuesToRender.length === 0) {
        issuesContainer.innerHTML = `<p class="text-gray-500 text-center col-span-full py-10">No issues found.</p>`;
        return;
    }

    issuesToRender.forEach(issue => {
        const isOpen = issue.status?.toLowerCase() === 'open';
        const topBorderClass = isOpen ? 'border-green-500' : 'border-[#4f23ff]';
        const iconColorClass = isOpen ? 'text-green-500' : 'text-[#4f23ff]';
        
        const formattedDate = new Date(issue.createdAt).toLocaleDateString();

        const cardHTML = `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 ${topBorderClass} p-5 flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer" onclick="openModal('${issue._id || issue.id}')">
                
                <div class="flex justify-between items-start mb-3">
                    <i class="fa-solid fa-circle-dot ${iconColorClass} mt-1"></i>
                    <span class="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">
                        ${issue.priority || 'Medium'}
                    </span>
                </div>
                
                <h3 class="text-sm font-bold text-gray-900 mb-2 leading-snug line-clamp-2">${issue.title || 'Untitled Issue'}</h3>
                <p class="text-xs text-gray-500 mb-4 line-clamp-2 flex-grow">${issue.description || 'No description provided.'}</p>
                
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-200 text-red-500 bg-red-50 flex items-center gap-1">
                        <i class="fa-solid fa-bug"></i> ${issue.category || 'Bug'}
                    </span>
                    <span class="text-[10px] font-bold px-2.5 py-1 rounded-full border border-yellow-200 text-yellow-600 bg-yellow-50 flex items-center gap-1">
                        <i class="fa-solid fa-hand-holding-heart"></i> ${issue.label || 'Help Wanted'}
                    </span>
                </div>
                
                <div class="mt-auto pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                    <p>#${issue._id || issue.id || 'ID'} by ${issue.author || 'Unknown'}</p>
                    <p>${formattedDate}</p>
                </div>
            </div>
        `;
        
        issuesContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

const modalContainer = document.getElementById('issue-modal');

async function openModal(id) {
    modalContainer.classList.remove('hidden');
    modalContainer.innerHTML = `
        <div class="bg-white rounded-xl p-8 w-full max-w-2xl text-center shadow-2xl">
            <i class="fa-solid fa-spinner fa-spin text-4xl text-[#4f23ff]"></i>
            <p class="mt-4 text-gray-500 font-medium">Loading issue details...</p>
        </div>
    `;

    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await response.json();
        const issue = data.data || data; 

        const isOpen = issue.status?.toLowerCase() === 'open';
        const statusBg = isOpen ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700';
        const formattedDate = new Date(issue.createdAt).toLocaleDateString();

        modalContainer.innerHTML = `
            <div class="bg-white rounded-xl p-6 md:p-8 w-full max-w-2xl relative shadow-2xl mx-4">
                <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">${issue.title}</h2>
                
                <div class="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500 mb-5">
                    <span class="px-2.5 py-0.5 rounded-full font-bold ${statusBg} capitalize tracking-wide">
                        ${issue.status}
                    </span>
                    <span>• Opened by <span class="font-bold text-gray-700">${issue.author}</span></span>
                    <span>• ${formattedDate}</span>
                </div>

                <div class="flex flex-wrap gap-2 mb-6">
                    <span class="text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-200 text-red-500 bg-red-50 flex items-center gap-1 uppercase tracking-wider">
                        <i class="fa-solid fa-bug"></i> ${issue.category || 'Bug'}
                    </span>
                    <span class="text-[10px] font-bold px-2.5 py-1 rounded-full border border-yellow-200 text-yellow-600 bg-yellow-50 flex items-center gap-1 uppercase tracking-wider">
                        <i class="fa-solid fa-hand-holding-heart"></i> ${issue.label || 'Help Wanted'}
                    </span>
                </div>

                <p class="text-gray-700 mb-6 text-sm leading-relaxed border-b border-gray-100 pb-6">${issue.description}</p>

                <div class="bg-[#f8f9fa] p-4 rounded-lg flex justify-between items-center mb-6 border border-gray-100">
                    <div>
                        <p class="text-xs text-gray-500 font-semibold mb-1">Assignee:</p>
                        <p class="text-sm font-bold text-gray-900">${issue.assignee || 'Unassigned'}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-500 font-semibold mb-1">Priority:</p>
                        <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600 uppercase tracking-wide">
                            ${issue.priority || 'High'}
                        </span>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button onclick="closeModal()" class="bg-[#4f23ff] hover:bg-[#3d19d6] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f23ff]">
                        Close
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error fetching single issue:", error);
        modalContainer.innerHTML = `
            <div class="bg-white rounded-xl p-8 w-full max-w-2xl text-center shadow-2xl mx-4">
                <h2 class="text-xl font-bold text-red-600 mb-2">Oops! Something went wrong.</h2>
                <p class="text-gray-600 mb-6">We couldn't load the details for this issue.</p>
                <button onclick="closeModal()" class="bg-[#4f23ff] text-white px-6 py-2 rounded-md font-medium">Close</button>
            </div>
        `;
    }
}

function closeModal() {
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
}

modalContainer.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
        closeModal();
    }
});

fetchIssues();


const tabAll = document.getElementById('tab-all');
const tabOpen = document.getElementById('tab-open');
const tabClosed = document.getElementById('tab-closed');
const allTabButtons = [tabAll, tabOpen, tabClosed];

function setActiveTab(activeButton) {
    allTabButtons.forEach(btn => {
        btn.className = 'tab-btn px-6 py-1.5 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors';
    });
    
    activeButton.className = 'tab-btn px-6 py-1.5 rounded text-sm font-medium bg-[#4f23ff] text-white transition-colors';
}

tabAll.addEventListener('click', () => {
    setActiveTab(tabAll);
    renderIssues(allIssues);
});

tabOpen.addEventListener('click', () => {
    setActiveTab(tabOpen);
    const openIssues = allIssues.filter(issue => issue.status && issue.status.toLowerCase() === 'open');
    renderIssues(openIssues);
});

tabClosed.addEventListener('click', () => {
    setActiveTab(tabClosed);
    const closedIssues = allIssues.filter(issue => issue.status && issue.status.toLowerCase() === 'closed');
    renderIssues(closedIssues);
});

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('keypress', async function (event) {
    if (event.key === 'Enter') {
        const searchText = searchInput.value.trim();
        
        if (!searchText) {
            fetchIssues();
            return;
        }

        try {
            loadingSpinner.classList.remove('hidden');
            issuesContainer.classList.add('hidden');

            const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
            const data = await response.json();
            
            const searchResults = data.data || data; 

            renderIssues(searchResults);
            
            setActiveTab(tabAll);

        } catch (error) {
            console.error("Error searching issues:", error);
            issuesContainer.innerHTML = `<p class="text-red-500 text-center col-span-full py-10">Search failed. Please try again.</p>`;
        } finally {
            loadingSpinner.classList.add('hidden');
            issuesContainer.classList.remove('hidden');
        }
    }
});
