param(
  [string] $projectRoot = "."
)

$Resolve = { param( [string] $path ) Resolve-Path $path -ErrorAction SilentlyContinue }

$dist = &$Resolve "${projectRoot}/dist"
$types = &$Resolve "${projectRoot}/types" 

if ($null -ne $dist -and (Test-Path $dist)) {
  Remove-Item -Recurse $dist
}

if ($null -ne $types -and (Test-Path $types)) {
  Remove-Item -Recurse $types
}