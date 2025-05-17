console.log('Debug script loaded');

// Add global error handler
window.addEventListener('error', (event) => {
  console.log('Global error:', event.error);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.log('Unhandled promise rejection:', event.reason);
});
