import Aux from "../hoc/Auxiliary/Auxiliary";

const ProductFilter = (props) => {
  const collator = new Intl.Collator("he", {
    numeric: true,
    sensitivity: "base",
  });

  const sortProducts = (order) => {
    return [...props.products].sort((a, b) => {
      switch (order) {
        case "מהחדש לישן":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "מהישן לחדש":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "מהיקר לזול":
          return b.price - a.price;
        case "מהזול ליקר":
          return a.price - b.price;
        case "א - ת (שם)":
          return collator.compare(a.name, b.name);
        case "ת - א (שם)":
          return collator.compare(b.name, a.name);
        default:
          return 0;
      }
    });
  };

  const sortSelectHandler = (action) => {
    const sortedProducts = sortProducts(action);
    props.setFilterValue(action);
    props.setProductsState(sortedProducts);
    props.setProductsFilterState(props.filterGender === "הצג את כל המיגדרים" ? [...sortedProducts] : [...sortedProducts.filter(ele => ele.gender === props.filterGender)]);
  };

  const genderFilter = (gender) => {
    let filter = [...props.products];
    sortSelectHandler(props.filterValue);
    props.setFilterGender(gender);
    gender !== "הצג את כל המיגדרים"
      ? props.setProductsFilterState(
          filter.filter((ele) => ele.gender === gender)
        )
      : props.setProductsFilterState([...filter]);

  };
  return (
    <Aux>
      <select
        value={props.filterValue}
        onChange={(e) => sortSelectHandler(e.target.value)}
      >
        <option value="מהישן לחדש">מהישן לחדש</option>
        <option value="מהחדש לישן">מהחדש לישן</option>
        <option value="מהיקר לזול">מהיקר לזול</option>
        <option value="מהזול ליקר">מהזול ליקר</option>
        <option value="א - ת (שם)">א - ת (שם)</option>
        <option value="ת - א (שם)">ת - א (שם)</option>
      </select>

      <select
        value={props.filterGender}
        onChange={(e) => genderFilter(e.target.value)}
      >
        <option value="הצג את כל המיגדרים"> הצג את כל המיגדרים</option>
        <option value="שניהם">יוניסקס</option>
        <option value="זכר">זכר</option>
        <option value="נקבה">נקבה</option>
      </select>
    </Aux>
  );
};

export default ProductFilter;
