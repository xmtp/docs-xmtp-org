import React, { useState, useEffect } from 'react';
import { sidebarConfig } from '../../shared-sidebar.config';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AutoBreadcrumbProps {
  path?: BreadcrumbItem[];
}

export default function AutoBreadcrumb({ path }: AutoBreadcrumbProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => { 
    setIsMounted(true); 
  }, []);
  
  // Prevent hydration mismatches by not rendering until mounted
  if (!isMounted) return null;
  
  // Get current path from browser if available (for client-side)
  const getCurrentPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '';
  };

  const currentPath = getCurrentPath();
  
  // If custom path is provided, use it
  if (path && path.length > 0) {
    return (
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb-list">
          {path.map((item, index) => (
            <li key={index} className="breadcrumb-item">
              {item.href ? (
                <a href={item.href} className="breadcrumb-link">
                  {item.label}
                </a>
              ) : (
                <span className="breadcrumb-current">
                  {item.label}
                </span>
              )}
              {index < path.length - 1 && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Auto-generate breadcrumb based on sidebar structure
  // Note: Breadcrumbs are purely informational (no links) to provide location context
  // rather than navigation, since top nav and sidebar already handle navigation
  const generateBreadcrumb = (path: string) => {
    path = path.replace(/\/$/, "");
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Determine section
    let sectionKey = '';
    let sectionName = '';
    
    if (path.startsWith('/agents')) {
      sectionKey = '/agents/';
      sectionName = 'Build agents';
    } else if (path.startsWith('/chat-apps')) {
      sectionKey = '/chat-apps/';
      sectionName = 'Build chat apps';
    } else if (path.startsWith('/protocol')) {
      sectionKey = '/protocol/';
      sectionName = 'Protocol';
    } else if (path.startsWith('/network')) {
      sectionKey = '/network/';
      sectionName = 'Network';
    }
    
    if (!sectionKey) return [];
    
    // Always add the main section
    breadcrumbs.push({
      label: sectionName,
      href: undefined
    });
    
    // Find if this page is nested in a subsection
    const sidebarSection = sidebarConfig[sectionKey as keyof typeof sidebarConfig];
    if (sidebarSection) {
      for (const section of sidebarSection) {
        // Handle flat structure (like Protocol and Network sections)
        if (typeof section === 'object' && 'link' in section && !('items' in section)) {
          // This is a direct page item (flat structure)
          if (section.link === path) {
            // This is a top-level page, just return the section breadcrumb
            return breadcrumbs;
          }
        }
        // Handle nested structure (like Agents and Chat apps sections)
        else if (typeof section === 'object' && 'items' in section) {
          // Check if this is a direct page (like build-an-agent)
          if ('link' in section && section.link === path) {
            // This is a top-level page, just return the section breadcrumb
            return breadcrumbs;
          }
          
          // Check if this page is in a subsection
          if (section.items && section.items.length > 0) {
            for (const item of section.items) {
              if (item.link === path) {
                // Found the page in this subsection
                breadcrumbs.push({
                  label: section.text.replace(' 🤖', ''), // Remove emojis
                  href: undefined // Don't make subsection clickable for now
                });
                return breadcrumbs;
              }
            }
          }
        }
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumb(currentPath);
  
  if (breadcrumbs.length === 0) {
    return null; // No breadcrumb for homepage or unknown sections
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.href ? (
              <a href={item.href} className="breadcrumb-link">
                {item.label}
              </a>
            ) : (
              <span className="breadcrumb-current">
                {item.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="breadcrumb-separator" aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
