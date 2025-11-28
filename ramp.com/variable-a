console.log('Updating heading text...');

// Find the h2 with "Time is money. Save both." text
const headings = document.querySelectorAll('h2.headline-xs.text-center.text-primary');
let found = false;

for (const heading of headings) {
  if (heading.textContent.includes('Time is money')) {
    heading.textContent = 'The smarter way to manage your money and your time.';
    console.log('Updated heading text');
    found = true;
    break;
  }
}

if (found) {
  window.CFQ = window.CFQ || [];
  window.CFQ.push({ emit: 'variantRendered' });
} else {
  console.error('Heading not found');
}
