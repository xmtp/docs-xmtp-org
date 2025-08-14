// Mobile navigation dropdown for homepage
document.addEventListener('DOMContentLoaded', function() {
  console.log('Mobile nav script loaded');
  console.log('Body data-layout:', document.body.getAttribute('data-layout'));
  
  // Wait a bit for Vocs to render, then try again
  setTimeout(function() {
    console.log('Delayed check - Body data-layout:', document.body.getAttribute('data-layout'));
    console.log('Current URL:', window.location.pathname);
    console.log('Page has custom homepage class:', document.querySelector('.custom-homepage'));
    
    // Check multiple ways to detect homepage
    const isHomepage = 
      window.location.pathname === '/' || 
      window.location.pathname === '/index' ||
      document.body.getAttribute('data-layout') === 'landing' ||
      document.querySelector('.custom-homepage') !== null;
    
    console.log('Is homepage?', isHomepage);
    
    if (!isHomepage) {
      console.log('Not on homepage, exiting');
      return;
    }

    const compactNav = document.querySelector('.vocs_MobileTopNav_navigation_compact');
    const fullNav = document.querySelector('.vocs_MobileTopNav_navigation.vocs_NavigationMenu');
    const navList = document.querySelector('.vocs_MobileTopNav_navigation.vocs_NavigationMenu .vocs_NavigationMenu_list');
    
    console.log('Found elements:', {
      compactNav: !!compactNav,
      fullNav: !!fullNav, 
      navList: !!navList
    });
    
    console.log('Compact nav HTML:', compactNav?.innerHTML);
    console.log('Full nav HTML:', fullNav?.innerHTML);
    console.log('Nav list HTML:', navList?.innerHTML);
    console.log('Nav list children count:', navList?.children.length);
    
    if (!compactNav || !fullNav || !navList) {
      console.log('Homepage mobile nav elements not found');
      console.log('Available mobile nav elements:', document.querySelectorAll('[class*="MobileTopNav"]'));
      return;
    }

  let isDropdownOpen = false;

  // Create our own dropdown element instead of using the broken navList
  let customDropdown = null;

  // Add click handler to the compact nav button
  const compactButton = compactNav.querySelector('.vocs_MobileTopNav_navigationItem');
  if (compactButton) {
    compactButton.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent navigation
      e.stopPropagation();
      
      isDropdownOpen = !isDropdownOpen;
      
      if (isDropdownOpen) {
        // Create a completely new dropdown element from scratch
        customDropdown = document.createElement('div');
        customDropdown.id = 'custom-mobile-dropdown';
        
        // Style the new dropdown
        customDropdown.style.position = 'fixed';
        customDropdown.style.top = '80px';
        customDropdown.style.left = '20px';
        customDropdown.style.width = '280px';
        customDropdown.style.minHeight = '200px';
        customDropdown.style.zIndex = '99999';
        customDropdown.style.background = '#ffffff';
        customDropdown.style.border = '3px solid #5653C6';
        customDropdown.style.borderRadius = '8px';
        customDropdown.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
        customDropdown.style.padding = '1rem';
        customDropdown.style.display = 'flex';
        customDropdown.style.flexDirection = 'column';
        customDropdown.style.gap = '0.5rem';
        
        // Create navigation links manually
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
          link.style.display = 'block';
          link.style.padding = '0.75rem 1rem';
          link.style.borderRadius = '4px';
          link.style.textDecoration = 'none';
          link.style.color = '#333333';
          link.style.backgroundColor = '#f8f9fa';
          link.style.border = '1px solid #e9ecef';
          link.style.marginBottom = '0.25rem';
          
          link.addEventListener('click', function() {
            isDropdownOpen = false;
            if (customDropdown) {
              customDropdown.remove();
              customDropdown = null;
            }
          });
          
          customDropdown.appendChild(link);
        });
        
        // Add to page
        document.body.appendChild(customDropdown);
        
        console.log('Custom dropdown created and added to body');
        console.log('Dropdown position:', customDropdown.getBoundingClientRect());
        
      } else {
        // Remove the custom dropdown
        if (customDropdown) {
          customDropdown.remove();
          customDropdown = null;
        }
        console.log('Custom dropdown removed');
      }
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!compactNav.contains(e.target) && (!customDropdown || !customDropdown.contains(e.target))) {
      isDropdownOpen = false;
      if (customDropdown) {
        customDropdown.remove();
        customDropdown = null;
      }
    }
  });

    console.log('Homepage mobile navigation initialized');
  }, 1000); // Wait 1 second for Vocs to fully render
});
