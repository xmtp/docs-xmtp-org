// Mobile navigation dropdown for homepage
let mobileNavInitialized = false;
let globalClickHandler = null;
let globalKeyHandler = null;

function initializeMobileNav() {
  console.log('Initializing mobile nav...');
  console.log('Current URL:', window.location.pathname);
  console.log('Page has custom homepage class:', !!document.querySelector('.custom-homepage'));
  
  // Check if we're on the homepage
  const isHomepage = 
    window.location.pathname === '/' || 
    window.location.pathname === '/index' ||
    document.body.getAttribute('data-layout') === 'landing' ||
    document.querySelector('.custom-homepage') !== null;
  
  console.log('Is homepage?', isHomepage);
  
  // Clean up previous handlers if we're not on homepage
  if (!isHomepage) {
    console.log('Not on homepage, cleaning up');
    cleanupMobileNav();
    return;
  }

  // Don't re-initialize if already done for this page
  if (mobileNavInitialized) {
    console.log('Mobile nav already initialized');
    return;
  }
  
  // Check if we already updated the text for this button to prevent multiple updates
  const existingButton = document.querySelector('.vocs_MobileTopNav_navigation_compact .vocs_MobileTopNav_navigationItem[data-text-updated]');
  if (existingButton && existingButton.textContent.trim() === 'Start building') {
    console.log('Button text already updated, skipping');
    mobileNavInitialized = true;
    return;
  }

  // Find mobile navigation elements
  const compactNav = document.querySelector('.vocs_MobileTopNav_navigation_compact');
  const compactButton = compactNav?.querySelector('.vocs_MobileTopNav_navigationItem');
  
  console.log('Found elements:', {
    compactNav: !!compactNav,
    compactButton: !!compactButton
  });
  
  if (!compactNav || !compactButton) {
    console.log('Homepage mobile nav elements not found, retrying in 500ms');
    setTimeout(initializeMobileNav, 500);
    return;
  }

  // Update the button text to "Start building" for homepage
  if (!compactButton.hasAttribute('data-text-updated')) {
    compactButton.textContent = 'Start building';
    compactButton.setAttribute('data-text-updated', 'true');
    console.log('Updated button text to "Start building"');
  }

  let isDropdownOpen = false;
  let customDropdown = null;

  // Remove any existing click handler to prevent duplicates
  const existingHandler = compactButton._mobileNavHandler;
  if (existingHandler) {
    compactButton.removeEventListener('click', existingHandler);
  }

  // Create new click handler
  const clickHandler = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Compact nav clicked, current state:', isDropdownOpen);
    
    isDropdownOpen = !isDropdownOpen;
    
    if (isDropdownOpen) {
      showDropdown();
    } else {
      hideDropdown();
    }
  };

  // Store the handler reference for cleanup
  compactButton._mobileNavHandler = clickHandler;
  compactButton.addEventListener('click', clickHandler);

  function showDropdown() {
    // Remove any existing dropdown
    hideDropdown();
    
    // Create dropdown element
    customDropdown = document.createElement('div');
    customDropdown.id = 'custom-mobile-dropdown';
    
    // Get the position of the compact nav to position dropdown properly
    const compactRect = compactNav.getBoundingClientRect();
    
    // Style the dropdown to match Vocs interior page styling
    const isDark = document.documentElement.classList.contains('dark');
    Object.assign(customDropdown.style, {
      position: 'fixed',
      top: (compactRect.bottom + 8) + 'px',
      left: compactRect.left + 'px',
      minWidth: '200px',
      width: Math.max(200, compactRect.width) + 'px',
      zIndex: '99999',
      background: isDark ? 'var(--vocs-color-bg-2, #1a1a1a)' : 'var(--vocs-color-bg-2, #f8f9fa)',
      border: `1px solid ${isDark ? 'var(--vocs-color-border, #404040)' : 'var(--vocs-color-border, #e9ecef)'}`,
      borderRadius: '4px',
      boxShadow: isDark 
        ? '0 3px 10px rgba(0, 0, 0, 0.3)' 
        : '0 3px 10px rgba(0, 0, 0, 0.1)',
      padding: '0.75rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0px',
      opacity: '0',
      transform: 'translateY(-6px)',
      transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
    });
    
    // Trigger entrance animation
    requestAnimationFrame(() => {
      customDropdown.style.opacity = '1';
      customDropdown.style.transform = 'translateY(0px)';
    });
    
    // Create navigation links
    const navLinks = [
      { text: 'Build agents', href: '/agents/intro/intro' },
      { text: 'Build inboxes', href: '/inboxes/intro/intro' },
      { text: 'Protocol', href: '/protocol/envelope-types' },
      { text: 'Network', href: '/network/run-a-node' }
    ];
    
    navLinks.forEach(linkData => {
      const link = document.createElement('a');
      link.href = linkData.href;
      link.textContent = linkData.text;
      
      Object.assign(link.style, {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderRadius: '0',
        textDecoration: 'none',
        color: isDark ? 'var(--vocs-color-text, #e5e5e5)' : 'var(--vocs-color-text, #333333)',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${isDark ? 'var(--vocs-color-border, rgba(255,255,255,0.1))' : 'var(--vocs-color-border, #e9ecef)'}`,
        transition: 'color 0.1s ease',
        fontSize: '0.875rem',
        fontWeight: '500',
        height: '100%',
        width: '100%'
      });
      
      // Remove border from last item
      if (linkData === navLinks[navLinks.length - 1]) {
        link.style.borderBottom = 'none';
      }
      
      // Hover effects - match Vocs accent color behavior
      link.addEventListener('mouseenter', function() {
        this.style.color = isDark ? 'var(--vocs-color-text-accent, #9B98FF)' : 'var(--vocs-color-text-accent, #5E80F6)';
      });
      
      link.addEventListener('mouseleave', function() {
        this.style.color = isDark ? 'var(--vocs-color-text, #e5e5e5)' : 'var(--vocs-color-text, #333333)';
      });
      
      link.addEventListener('click', function() {
        hideDropdown();
      });
      
      customDropdown.appendChild(link);
    });
    
    // Add to page
    document.body.appendChild(customDropdown);
    
    console.log('Custom dropdown created and positioned');
  }

  function hideDropdown() {
    if (customDropdown) {
      // Fade out animation before removing
      customDropdown.style.opacity = '0';
      customDropdown.style.transform = 'translateY(-6px)';
      
      setTimeout(() => {
        if (customDropdown) {
          customDropdown.remove();
          customDropdown = null;
          isDropdownOpen = false;
          console.log('Custom dropdown removed');
        }
      }, 150); // Match the transition duration
    }
  }

  // Clean up old global handlers
  if (globalClickHandler) {
    document.removeEventListener('click', globalClickHandler);
  }
  if (globalKeyHandler) {
    document.removeEventListener('keydown', globalKeyHandler);
  }

  // Create new global handlers
  globalClickHandler = function(e) {
    if (!compactNav.contains(e.target) && (!customDropdown || !customDropdown.contains(e.target))) {
      hideDropdown();
    }
  };

  globalKeyHandler = function(e) {
    if (e.key === 'Escape') {
      hideDropdown();
    }
  };

  // Add new global handlers
  document.addEventListener('click', globalClickHandler);
  document.addEventListener('keydown', globalKeyHandler);

  mobileNavInitialized = true;
  console.log('Homepage mobile navigation initialized');
}

function cleanupMobileNav() {
  // Remove global handlers
  if (globalClickHandler) {
    document.removeEventListener('click', globalClickHandler);
    globalClickHandler = null;
  }
  if (globalKeyHandler) {
    document.removeEventListener('keydown', globalKeyHandler);
    globalKeyHandler = null;
  }
  
  // Remove any existing dropdown
  const existingDropdown = document.getElementById('custom-mobile-dropdown');
  if (existingDropdown) {
    existingDropdown.remove();
  }
  
  mobileNavInitialized = false;
  console.log('Mobile nav cleaned up');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Mobile nav script loaded');
  setTimeout(initializeMobileNav, 250);
});

// Re-initialize when navigating back to homepage (for SPAs)
let lastPathname = window.location.pathname;
function checkForPageChange() {
  if (window.location.pathname !== lastPathname) {
    lastPathname = window.location.pathname;
    mobileNavInitialized = false;
    console.log('Page changed to:', lastPathname);
    setTimeout(initializeMobileNav, 250);
  }
}

// Monitor for page changes (works with SPAs like Vocs)
setInterval(checkForPageChange, 250);

// Also listen for popstate events (browser back/forward)
window.addEventListener('popstate', function() {
  mobileNavInitialized = false;
  setTimeout(initializeMobileNav, 250);
});

// Listen for pushstate/replacestate (programmatic navigation)
(function() {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function() {
    originalPushState.apply(history, arguments);
    mobileNavInitialized = false;
    setTimeout(initializeMobileNav, 250);
  };

  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    mobileNavInitialized = false;
    setTimeout(initializeMobileNav, 250);
  };
})();
