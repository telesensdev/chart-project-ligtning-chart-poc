import react from "react";

const LargeDataToogler = ({ checked, handleTooggle, largeDataCount, updateLargeDataCount }) => {
  const maxCountLimit = 100000;


  return (
    <div>
      <div>
        <input
          type="checkbox"
          id="scales"
          name="scales"
          checked={checked}
          onChange={(e) => handleTooggle(e.target.checked)}
        />
        <label for="scales">Use large data objects</label>
      </div>

      <div>
        <input
          type="number"
          id="maxCountLimit"
          name="maxCountLimit"
          value = {largeDataCount}
          onChange={(e) => updateLargeDataCount(e.target.value < maxCountLimit ? e.target.value : maxCountLimit)}
        />
        <label for="scales">-large data count (limit is 100 000 - change maxCountLimit to update)</label>
      </div>
    </div>
  );
};

export default LargeDataToogler;
