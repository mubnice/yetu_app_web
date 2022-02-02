const product = require('../assets/image/product.png');
const category = require('../assets/image/category.png');
const back_rounded = require('../assets/image/back_rounded.png');
const back = require('../assets/image/back.png');
const search = require('../assets/image/search.png');
const search_fit = require('../assets/image/search_fit.png');
const edit = require('../assets/image/edit.png');
const delete_ = require('../assets/image/delete.png');
const close = require('../assets/image/close.png');
const arrow_down_combo = require('../assets/image/arrow_down_combo.png');
const arrow_right = require('../assets/image/arrow_right.png');
const book = require('../assets/image/book.png');
const article = require('../assets/image/article.png');
const favorite = require('../assets/image/favorite.png');
const law_1 = require('../assets/image/law_1.png');
const law_2 = require('../assets/image/law_2.png');
const law_3 = require('../assets/image/law_3.png');

const lawImage = id => {
  switch (id) {
    case 'law_1':
      return law_1;
    case 'law_2':
      return law_2;
    case 'law_3':
      return law_3;
    default:
      return law_1;
  }
};
export default {
  product,
  category,
  back_rounded,
  back,
  search,
  book,
  article,
  favorite,
  search_fit,
  edit,
  delete_,
  close,
  arrow_down_combo,
  arrow_right,
  lawImage,
};
