export function getStatusBadgeClass(status) {
  if (status === "Approved") {
    return "badge-success";
  } else {
    return "badge-danger";
  }
}
