import {SortTypes} from "../../../../../frontend/lib/SortTypes";
import Svg from "../../../../common/icons/Svg";
import {Button} from "@mantine/core";
import styles from "./IdSortButton.module.scss";

type Props = {
  sortType: SortTypes,
  onUpdate: (sortType: SortTypes) => void,
}
export default function IdSortButton(props: Props) {

  const {sortType, onUpdate} = props;

  return (
    <Button
      className={styles.idSortButton}
      ml={16}
      variant={"transparent"}
      size={"xs"}
      onClick={() => {
        if (sortType === SortTypes.ID_DESCENDING) {
          onUpdate(SortTypes.ID_ASCENDING);
        } else if (sortType === SortTypes.ID_ASCENDING) {
          onUpdate(SortTypes.ID_DESCENDING);
        } else {
          onUpdate(SortTypes.ID_ASCENDING);
        }
      }}
    >
      {sortType === SortTypes.ID_ASCENDING && <Svg icon={"caret-up-filled"}/>}
      {sortType === SortTypes.ID_DESCENDING && <Svg icon={"caret-down-filled"}/>}
      {sortType !== SortTypes.ID_ASCENDING && sortType !== SortTypes.ID_DESCENDING &&
        <Svg icon={"caret-down"}/>}
    </Button>
  );
}