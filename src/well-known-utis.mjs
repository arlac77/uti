const types = [
  {
    name: "public.item"
  },
  {
    name: "public.content"
  },
  {
    name: "public.message"
  },
  {
    name: "public.contact"
  },
  {
    name: "public.composite-content",
    conformsTo: "public.content"
  },
  {
    name: "public.data",
    conformsTo: "public.item"
  },
  {
    name: "public.database"
  },
  {
    name: "public.archive",
    conformsTo: "public.data"
  },
  {
    name: "public.directory",
    conformsTo: "public.item"
  },
  {
    name: "public.executable",
    conformsTo: "public.item"
  },
  {
    name: "com.microsoft.windows-dynamic-link-library",
    conformsTo: ["public.executable", "public.data"],
    mimeType: "application/x-msdownload",
    fileNameExtension: ".dll"
  },
  {
    name: "com.microsoft.windows-executable",
    conformsTo: ["public.executable", "public.data"],
    mimeType: "application/x-msdownload",
    fileNameExtension: ".exe"
  },
  {
    name: "public.object-code",
    conformsTo: ["public.executable", "public.data"],
    fileNameExtension: ".o"
  },
  {
    name: "public.unix-executable",
    conformsTo: ["public.executable", "public.data"]
  },
  {
    name: "com.sun.java-class",
    conformsTo: ["public.executable", "public.data"],
    fileNameExtension: ".class"
  },
  {
    name: "public.key-value",
    conformsTo: ["public.data"]
  },
  {
    name: "com.sun.java-properties",
    conformsTo: ["public.key-value"],
    fileNameExtension: ".properties",
    mimeType: "text/x-java-properties"
  },
  {
    name: "public.zip-archive",
    conformsTo: "public.archive",
    fileNameExtension: ".zip",
    mimeType: "application/zip"
  },
  {
    name: "com.sun.java-keystore",
    conformsTo: "public.archive",
    fileNameExtension: ".jks"
  },
  {
    name: "com.sun.java-archive",
    conformsTo: ["public.executable", "public.zip-archive"],
    mimeType: "application/x-java-archive",
    fileNameExtension: ".jar"
  },
  {
    name: "com.sun.java-web-archive",
    conformsTo: ["public.executable", "public.zip-archive"],
    fileNameExtension: ".war"
  },
  {
    name: "com.sun.java-enterprise-archive",
    conformsTo: ["public.executable", "public.zip-archive"],
    fileNameExtension: ".ear"
  },
  {
    name: "public.folder",
    conformsTo: "public.directory"
  },
  {
    name: "public.volume",
    conformsTo: "public.folder"
  },
  {
    name: "com.apple.resolvable"
  },
  {
    name: "public.symlink",
    conformsTo: ["public.item", "com.apple.resolvable"]
  },
  {
    name: "public.url",
    conformsTo: "public.data"
  },
  {
    name: "public.file-url",
    conformsTo: "public.url"
  },
  {
    name: "public.text",
    conformsTo: ["public.data", "public.content"]
  },
  {
    name: "public.plain-text",
    conformsTo: "public.text",
    fileNameExtension: ".txt",
    mimeType: "text/plain"
  },
  {
    name: "public.utf8-plain-text",
    conformsTo: "public.plain-text"
  },
  {
    name: "public.utf16-external-plain-​text",
    conformsTo: "public.plain-text"
  },
  {
    name: "public.utf16-plain-text",
    conformsTo: "public.plain-text"
  },
  {
    name: "public.rtf",
    conformsTo: "public.text",
    fileNameExtension: ".rtf",
    mimeType: "text/rtf"
  },
  {
    name: "public.html",
    conformsTo: "public.text",
    fileNameExtension: [".html", ".htm"],
    mimeType: "text/html"
  },
  {
    name: "public.xml",
    conformsTo: "public.text",
    fileNameExtension: ".xml",
    mimeType: "text/xml"
  },
  {
    name: "public.json",
    conformsTo: "public.text",
    fileNameExtension: ".json",
    mimeType: ["application/json", "text/json"]
  },
  {
    name: "public.toml",
    conformsTo: "public.text",
    fileNameExtension: ".toml",
    mimeType: "application/toml"
  },
  {
    name: "public.ini",
    conformsTo: "public.text",
    fileNameExtension: ".ini",
    mimeType: "zz-application/zz-winassoc-ini"
  },
  {
    name: "public.source-code",
    conformsTo: "public.plain-text"
  },
  {
    name: "public.script",
    conformsTo: "public.source-code"
  },
  {
    name: "com.sun.java-source",
    conformsTo: "public.source-code",
    fileNameExtension: [".java", ".jav"]
  },
  {
    name: "public.shell-script",
    conformsTo: "public.script",
    fileNameExtension: [".sh", ".command"],
    mimeType: ["text/x-shellscript"]
  },
  {
    name: "public.bash-script",
    conformsTo: "public.shell-script",
    fileNameExtension: [".bash"]
  },
  {
    name: "public.ksh-script",
    conformsTo: "public.shell-script",
    fileNameExtension: [".ksh"],
    mimeType: ["text/x-script.ksh", "application/x-ksh"]
  },
  {
    name: "public.assembly-source",
    conformsTo: "public.source-code",
    fileNameExtension: ".s"
  },
  {
    name: "com.netscape.javascript-source",
    conformsTo: ["public.source-code", "public.executable"],
    fileNameExtension: [".js", ".jscript", ".javascript"],
    mimeType: ["application/javascript", "application/ecmascript"]
  },
  {
    name: "public.bzip2-archive",
    conformsTo: "public.archive",
    fileNameExtension: ".bzip2"
  },
  {
    name: "org.gnu.gnu-tar-archive",
    conformsTo: "public.archive",
    fileNameExtension: ".tar",
    mimeType: "application/x-tar"
  },
  {
    name: "public.tar-archive",
    conformsTo: "org.gnu.gnu-tar-archive",
    fileNameExtension: ".tar",
    mimeType: ["application/x-tar", "application/tar"]
  },
  {
    name: "org.gnu.gnu-zip-archive",
    conformsTo: "public.archive",
    fileNameExtension: [".gz", ".gzip"],
    mimeType: ["application/gzip", "application/x-gzip"]
  },
  {
    name: "org.gnu.gnu-zip-tar-archive",
    conformsTo: "org.gnu.gnu-zip-archive",
    mimeType: "application/tar+gzip",
    fileNameExtension: [".tar.gz", ".tgz"]
  },
  {
    name: "com.apple.xar-archive",
    conformsTo: "public.archive",
    fileNameExtension: ".xar"
  },
  {
    name: "public.xz-archive",
    conformsTo: "public.archive",
    fileNameExtension: ".xz",
    mimeType: "application/x-xz"
  },
  {
    name: "public.7z-archive",
    conformsTo: "public.archive",
    fileNameExtension: ".7z",
    mimeType: "application/x-7z-compressed"
  },
  {
    name: "public.rar-archive",
    conformsTo: "public.archive",
    fileNameExtension: ".rar",
    mimeType: ["application/x-rar-compressed", "application/vnd.rar"]
  },
  {
    name: "public.cpio-archive",
    conformsTo: "public.archive",
    fileNameExtension: ".cpio",
    mimeType: "application/x-cpio"
  },
  {
    name: "public.rpm-archive",
    conformsTo: "public.archive",
    fileNameExtension: ".rpm",
    mimeType: "application/x-rpm"
  },
  {
    name: "public.ar-archive",
    conformsTo: "public.archive",
    fileNameExtension: [".a",".lib"]
  },
  {
    name: "public.deb-archive",
    conformsTo: "public.ar-archive",
    fileNameExtension: ".deb",
    mimeType: "application/vnd.debian.binary-package"
  },
  {
    name: "public.arch-linux-archive",
    conformsTo: "public.archive",
    fileNameExtension: ".pkg.tar.xz"
  },
  {
    name: "com.apple.package",
    conformsTo: "public.directory"
  },
  {
    name: "com.apple.application",
    conformsTo: "public.data"
  },
  {
    name: "com.apple.application-bundle",
    conformsTo: "com.apple.application",
    fileNameExtension: [
      ".app",
      ".framework",
      ".kext",
      ".plugin",
      ".docset",
      ".xpc",
      ".qlgenerator",
      ".component",
      ".saver",
      ".mdimport"
    ]
  },
  {
    name: "public.disk-image",
    conformsTo: "public.archive"
  },
  {
    name: "public.image",
    conformsTo: ["public.data", "public.content"]
  },
  {
    name: "public.case-insensitive-text"
  },
  {
    name: "public.filename-extension",
    conformsTo: "public.case-insensitive-text"
  },
  {
    name: "public.mime-type",
    conformsTo: "public.case-insensitive-text"
  },
  {
    name: "public.presentation",
    conformsTo: "public.composite-content"
  },
  {
    name: "com.microsoft.word.doc",
    conformsTo: ["public.data", "public.composite-content"],
    fileNameExtension: ".docx"
  },
  {
    name: "com.microsoft.excel.xls",
    conformsTo: ["public.data", "public.composite-content"],
    fileNameExtension: ".xlsx"
  },
  {
    name: "com.microsoft.powerpoint.ppt",
    conformsTo: ["public.data", "public.presentation"],
    fileNameExtension: ".ppt"
  },
  {
    name: "com.microsoft.word.wordml",
    conformsTo: ["public.data", "public.composite-content"]
  },
  {
    name: "public.image",
    conformsTo: ["public.data", "public.content"]
  },
  {
    name: "public.jpeg",
    conformsTo: "public.image",
    fileNameExtension: [".jpg", ".jpeg"]
  },
  {
    name: "com.adobe.postscript",
    conformsTo: "public.image",
    fileNameExtension: [".ps"],
    mimeType: ["application/postscript"]
  },
  {
    name: "net.daringfireball.markdown",
    conformsTo: "public.text",
    fileNameExtension: [".md", ".markdown"],
    mimeType: ["text/markdown"]
  },
  {
    name: "com.apple.disk-image",
    conformsTo: "public.disk-image",
    fileNameExtension: [".dmg", ".smi", ".img"],
    mimeType: ["application/x-apple-diskimage"]
  },
  {
    name: "public.security.private-key",
    conformsTo: "public.data"
  },
  {
    name: "public.security.certificate",
    conformsTo: "public.data"
  },
  {
    name: "public.security.certificate.trust",
    conformsTo: "public.security.certificate"
  },
  {
    name: "public.security.certificate.request",
    conformsTo: "public.data"
  },
  {
    name: "public.pkcs8",
    conformsTo: "public.data",
    fileNameExtension: [".p8", ".key"],
    mimeType: "application/pkcs8"
  },
  {
    name: "public.pkcs10",
    conformsTo: "public.data",
    fileNameExtension: [".p10", ".csr"],
    mimeType: "application/pkcs10"
  },
  {
    name: "public.pkix-cert",
    conformsTo: "public.security.certificate",
    fileNameExtension: ".cer",
    mimeType: "application/pkix-cert"
  },
  {
    name: "public.pkix-crl",
    conformsTo: "public.data",
    fileNameExtension: ".crl",
    mimeType: "application/pkix-crl"
  },
  {
    name: "public.pkcs7-mime",
    conformsTo: "public.data",
    fileNameExtension: ".p7c",
    mimeType: "application/pkcs7-mime"
  },
  {
    name: "public.x-x509-ca-cert",
    conformsTo: "public.security.certificate",
    fileNameExtension: [".crt", ".der"],
    mimeType: "application/x-x509-ca-cert"
  },
  {
    name: "public.x-x509-user-cert",
    conformsTo: "public.security.certificate",
    fileNameExtension: ".crt",
    mimeType: "application/x-x509-user-cert"
  },
  {
    name: "public.x-pkcs7-crl",
    conformsTo: "public.data",
    fileNameExtension: ".crl",
    mimeType: "application/x-pkcs7-crl"
  },
  {
    name: "public.x-pkcs12",
    conformsTo: "public.data",
    fileNameExtension: ".pem",
    mimeType: "application/x-pem-file"
  },
  {
    name: "public.x-pem-file",
    conformsTo: "public.data",
    fileNameExtension: [".p12", ".pfx"],
    mimeType: "application/x-pkcs12"
  },
  {
    name: "public.x-pkcs7-certificates",
    conformsTo: "public.security.certificate",
    fileNameExtension: [".p7b", ".spc"],
    mimeType: "application/x-pkcs7-certificates"
  },
  {
    name: "public.x-pkcs7-certreqresp",
    conformsTo: "public.data",
    fileNameExtension: ".p7r",
    mimeType: "application/x-pkcs7-certreqresp"
  }
];

export default types;
