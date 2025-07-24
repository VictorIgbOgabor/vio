// blog.js

// 'db' is made available globally from the script tag in blog.html after Firebase initialization.

const blogPostsContainer = document.getElementById('blog-posts-container');
const blogPagination = document.querySelector('.blog-pagination');
const loadingMessage = document.getElementById('loading-message');

const PAGE_SIZE = 6; // Number of posts per page displayed initially (can be adjusted)

async function fetchBlogPosts() {
    // Show loading message initially
    if (loadingMessage) {
        loadingMessage.style.display = 'block';
    }
    blogPostsContainer.innerHTML = ''; // Clear any existing content or old loading messages

    try {
        // Query Firestore for blog posts, ordered by publishedDate (newest first)
        const querySnapshot = await db.collection('blogPosts') // <-- IMPORTANT: Ensure 'blogPosts' is your collection name
                                      .orderBy('publishedDate', 'desc')
                                      .limit(PAGE_SIZE) // Fetch a limited number of posts
                                      .get();

        // Hide loading message once data is fetched or if no posts
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }

        if (querySnapshot.empty) {
            blogPostsContainer.innerHTML = '<p class="text-center text-gray-600 col-span-full">No blog posts found yet. Check back soon!</p>';
            if (blogPagination) {
                blogPagination.style.display = 'none'; // Hide pagination if no posts
            }
            return;
        }

        querySnapshot.forEach(doc => {
            const post = doc.data();
            const postId = doc.id; // Get the document ID for linking to single post page

            // Format date for display
            const date = post.publishedDate && typeof post.publishedDate.toDate === 'function' // Check if it's a Firestore Timestamp
                         ? post.publishedDate.toDate().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                           })
                         : 'No Date'; // Fallback if no date or not a Timestamp

            // Construct the HTML for a single blog post card
            const postCardHTML = `
                <div class="blog-post-card">
                    <img src="${post.imageUrl || 'https://via.placeholder.com/600x350/CCCCCC/888888?text=No+Image'}" alt="${post.title || 'Blog Post Image'}">
                    <div class="content">
                        <div class="meta">
                            <span><i class="far fa-calendar-alt"></i> ${date}</span>
                            <span><i class="far fa-folder"></i> ${post.category || 'Uncategorized'}</span>
                        </div>
                        <h3>${post.title || 'Untitled Post'}</h3>
                        <p>${post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : 'No content preview available.')}</p>
                        <a href="blog-post.html?id=${postId}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            blogPostsContainer.innerHTML += postCardHTML;
        });

        // Simple pagination visibility logic (you'll need more JS for actual working pagination)
        if (blogPagination) { // Check if pagination element exists
            if (querySnapshot.docs.length < PAGE_SIZE) {
                blogPagination.style.display = 'none'; // Hide if fewer posts than page size
            } else {
                blogPagination.style.display = 'flex'; // Show if more posts might exist
            }
        }


    } catch (error) {
        console.error("Error fetching blog posts:", error);
        if (loadingMessage) {
            loadingMessage.style.display = 'none'; // Hide loading message on error
        }
        blogPostsContainer.innerHTML = '<p class="text-center text-red-500 col-span-full">Error loading blog posts. Please try again later.</p>';
    }
}

// Call the function to load posts when the page finishes loading
document.addEventListener('DOMContentLoaded', fetchBlogPosts);

// --- IMPORTANT: What to do next for single blog post pages ---
// The 'Read More' link (a href="blog-post.html?id=${postId}") in this code
// assumes you will have a separate page (e.g., `blog-post.html`).
//
// You MUST create this `blog-post.html` file and write JavaScript there to:
// 1. Get the 'id' from the URL query parameter (e.g., `new URLSearchParams(window.location.search).get('id')`).
// 2. Use that ID to fetch the specific blog post document from your 'blogPosts' collection in Firestore.
// 3. Dynamically render the full title, image, date, and content of that post on the `blog-post.html` page.
// This `blog-post.html` will also need the Firebase SDKs and initialization similar to your blog.html.