module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
     'camelcase': [1, {"properties": "never"}] ,
   /*   "camelcase": ["error", {"allow": ["aa_bb"]}] */ 
  },


  parserOptions: {
    parser: 'babel-eslint'
  }
}
