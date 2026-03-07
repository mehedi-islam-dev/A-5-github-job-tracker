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

function openModal(id) {
    console.log("Clicked issue ID:", id);
}

fetchIssues();