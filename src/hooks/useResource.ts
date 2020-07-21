import { Ref, ref } from '@vue/composition-api';
import {
  FETCH_STATUSES,
  FetchStatus,
  getMessageFromError,
  ResponseBody,
} from '@tager/admin-services';

function useResource<T>(params: {
  fetchResource: () => Promise<ResponseBody<T>>;
  initialValue: T;
}) {
  const data = ref<T>(params.initialValue);
  const status = ref<FetchStatus>(FETCH_STATUSES.IDLE);
  const error = ref<string | null>(null);

  function refreshEntityList(): Promise<void> {
    status.value = FETCH_STATUSES.LOADING;

    return params
      .fetchResource()
      .then((response) => {
        (data as Ref<T>).value = response.data;
        status.value = FETCH_STATUSES.SUCCESS;
        error.value = null;
      })
      .catch((error) => {
        console.error(error);
        (data as Ref<T>).value = params.initialValue;
        status.value = FETCH_STATUSES.FAILURE;
        error.value = getMessageFromError(error);
      });
  }

  return { data, status, error, refresh: refreshEntityList };
}

export default useResource;
