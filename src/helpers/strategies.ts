const requireFile = require.context('./strategies', true, /index\.ts$/);

const requireReadmeFile = require.context('./strategies', true, /README\.md$/);

export default Object.fromEntries(
  requireFile
    .keys()
    .filter(fileName => fileName !== './index.ts')
    .map(fileName => {
      const key = fileName.replace('./', '').replace('/index.ts', '');
      const strategy = requireFile(fileName);
      strategy.key = key;
      try {
        strategy.about = requireReadmeFile(
          fileName.replace('index.ts', 'README.md')
        ).default;
      } catch (error) {
        strategy.about = '';
      }
      return [key, strategy];
    })
);
