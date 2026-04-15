module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    tags: 'not @template',
    import: ['support/**/*.js', 'step_definitions/**/*.js'],
  },
};
