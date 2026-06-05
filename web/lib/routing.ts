/** Where to send a logged-in user after login/register. */
export async function resolvePostLoginPath(_userId: string): Promise<string> {
  return "/hub";
}
