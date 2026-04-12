export function uploadWithToken(
  url,
  formData,
  { onProgress, onSuccess, onError },
) {
  const token = localStorage.getItem("token");

  const xhr = new XMLHttpRequest();

  xhr.open("POST", url);

  xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  xhr.setRequestHeader("Accept", "application/json");

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable && onProgress) {
      const percent = Math.round((e.loaded / e.total) * 100);
      onProgress(percent);
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 201) {
      onSuccess && onSuccess(JSON.parse(xhr.response));
    } else if (xhr.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user-info");
      window.location.href = "/";
    } else if (xhr.status === 422) {
      onError && onError("Erreur de validation");
    } else {
      onError && onError("Erreur upload");
    }
  };

  xhr.onerror = () => {
    onError && onError("Erreur réseau");
  };

  xhr.send(formData);
}
