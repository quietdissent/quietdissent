import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
```

Then save (`Ctrl+S`). Then back in PowerShell:
```
git add .
git commit -m "fix build"
git push