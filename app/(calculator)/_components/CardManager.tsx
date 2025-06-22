import type { CardCounts } from "@/app/(calculator)/_types/card";

interface Props {
  cards: CardCounts;
  onChange: (card: CardCounts) => void;
}

export const CardManager = ({ cards, onChange }: Props) => {
  return <></>;
};
