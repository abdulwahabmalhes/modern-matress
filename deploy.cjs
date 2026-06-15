const { spawn } = require('child_process');

const surge = spawn('npx', ['--yes', 'surge', './dist', 'modern-mattresses-preview-999.surge.sh'], { shell: true });

surge.stdout.on('data', (data) => {
  const str = data.toString();
  console.log(str);
  if (str.toLowerCase().includes('email:')) {
    console.log('Sending email...');
    surge.stdin.write('modern-mattresses-demo123@gmail.com\n');
  }
  if (str.toLowerCase().includes('password:')) {
    console.log('Sending password...');
    surge.stdin.write('Demo1234!\n');
  }
});

surge.stderr.on('data', (data) => {
  console.error('STDERR:', data.toString());
});

surge.on('close', (code) => {
  console.log('Surge exited with code ' + code);
});
