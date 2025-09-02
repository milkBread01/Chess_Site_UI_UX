export default function Square({ id, value, onClick }) {
  return (
    <button className={`square square-${id}`} onClick={onClick}>
      {value}
    </button>
  );
}
