import { Title } from "@mantine/core";
import { useEffect, useState } from "react";
import useApiRequest from "../hooks/useApiRequest";
import kopiaService from "../kopiaService";
import type { Status } from "../types";

export default function RepoTitle() {
  const [data, setData] = useState<Status>();
  const { execute } = useApiRequest({
    action: () => kopiaService.getStatus(),
    onReturn(resp) {
      setData(resp);
    },
  });

  useEffect(() => {
    execute();
  }, []);

  return <Title order={1}>{data?.description || "Failed to load"}</Title>;
}
