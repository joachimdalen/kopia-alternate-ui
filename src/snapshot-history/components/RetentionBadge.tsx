import { Badge } from "@mantine/core";

type Props = {
  retention: string;
};

export default function RetentionBadge({ retention }: Props) {
  const getColor = () => {
    if (retention.startsWith("latest-")) {
      return "green";
    }
    if (retention.startsWith("daily-")) {
      return "indigo";
    }
    if (retention.startsWith("weekly-")) {
      return "red";
    }
    if (retention.startsWith("monthly-")) {
      return "gray";
    }
    if (retention.startsWith("annual-")) {
      return "yellow";
    }
    return "teal";
  };

  return (
    <Badge tt="none" color={getColor()} radius={5}>
      {retention}
    </Badge>
  );
}
