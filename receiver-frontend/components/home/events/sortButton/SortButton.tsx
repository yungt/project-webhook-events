import {SortTypes} from "../../../../frontend/lib/SortTypes";
import Svg from "../../../common/icons/Svg";
import {Button} from "@mantine/core";
import styles from "./SortButton.module.scss";

type Props = {
  sortType: SortTypes,
  ascendingType: SortTypes,
  descendingType: SortTypes,
  onUpdate: (sortType: SortTypes) => void,
}
export default function SortButton(props: Props) {

  const {sortType, ascendingType, descendingType, onUpdate} = props;

  const toggle = () => {
    if (sortType === descendingType) {
      onUpdate(ascendingType);
    } else if (sortType === ascendingType) {
      onUpdate(descendingType);
    } else {
      onUpdate(ascendingType);
    }
  }

  return (
    <Button
      className={styles.sortButton}
      ml={16}
      variant={"transparent"}
      size={"xs"}
      onClick={() => toggle()}
    >
      {sortType === ascendingType && <Svg icon={"caret-up-filled"}/>}
      {sortType === descendingType && <Svg icon={"caret-down-filled"}/>}
      {sortType !== ascendingType && sortType !== descendingType &&
        <Svg icon={"caret-down"}/>}
    </Button>
  );
}