{ pkgs,nixpkgs ? { } }:

pkgs.mkShell
{
  nativeBuildInputs = [
    pkgs.trashy
    pkgs.nodejs_22
  ];

  shellHook = ''
    alias rm="trash -c always put"
  '';
}
