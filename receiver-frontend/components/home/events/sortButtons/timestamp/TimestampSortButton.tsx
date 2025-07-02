import {SortTypes} from "../../../../../frontend/lib/SortTypes";
import Svg from "../../../../common/icons/Svg";
import {Button} from "@mantine/core";
import styles from "./TimestampSortButton.module.scss";

type Props = {
  sortType: SortTypes,
  onUpdate: (sortType: SortTypes) => void,
}
export default function TimestampSortButton(props: Props) {

  const {sortType, onUpdate} = props;

  return (
    <Button
      className={styles.timestampSortButton}
      ml={16}
      variant={"transparent"}
      size={"xs"}
      onClick={() => {
        if (sortType === SortTypes.TIMESTAMP_DESCENDING) {
          onUpdate(SortTypes.TIMESTAMP_ASCENDING);
        } else if (sortType === SortTypes.TIMESTAMP_ASCENDING) {
          onUpdate(SortTypes.TIMESTAMP_DESCENDING);
        } else {
          onUpdate(SortTypes.TIMESTAMP_ASCENDING);
        }
      }}
    >
      {sortType === SortTypes.TIMESTAMP_ASCENDING && <Svg icon={"caret-up-filled"}/>}
      {sortType === SortTypes.TIMESTAMP_DESCENDING && <Svg icon={"caret-down-filled"}/>}
      {sortType !== SortTypes.TIMESTAMP_ASCENDING && sortType !== SortTypes.TIMESTAMP_DESCENDING &&
        <Svg icon={"caret-down"}/>}
    </Button>
  );
}