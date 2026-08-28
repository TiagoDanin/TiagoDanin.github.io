declare module 'npm-user-packages-downloads' {
  interface NpmPackage {
    name: string;
    [key: string]: unknown;
  }

  export default function npmUserPackages(
    username: string,
    period: string
  ): Promise<NpmPackage[]>;
}
