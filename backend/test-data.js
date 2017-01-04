const users = [
  {
    'name': 'Andrew Pouliot',
    'id': 'andrew',
  },
  {
    'name': 'Test User',
    'id': 'tu',
  },
];

const works = [
  {
    'id': 'bg_blue',
    'name': 'Example Blue',
    'baseURL': 'https://storage.googleapis.com/floating-ink/quills/bg_blue',
    'previewURL': 'https://storage.googleapis.com/floating-ink/previews/bg_blue.png',
    'bgColor': '#0000ff',
    'by': 'tu',
  },
  {
    'id': 'happy_new_year',
    'name': 'Example 1',
    'baseURL': 'https://storage.googleapis.com/floating-ink/quills/happy_new_year',
    'previewURL': 'https://storage.googleapis.com/floating-ink/previews/happy_new_year.png',
    'bgColor': '#000000',
    'by': 'tu',
  },
  {
    'id': 'bg_black_1white_1grey_1pink',
    'name': 'Example 2',
    'baseURL': 'https://storage.googleapis.com/floating-ink/quills/bg_black_1white_1grey_1pink',
    'previewURL': 'https://storage.googleapis.com/floating-ink/previews/bg_black_1white_1grey_1pink.png',
    'bgColor': '#000000',
    'by': 'andrew',
  },
];

const workById = (workId) => works.find( (u) => u.id == workId );

module.exports = {users, works, workById};