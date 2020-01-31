param(
  [string] $projectRoot = "."
)

$Resolve = { param( [string] $path ) Resolve-Path $path -ErrorAction SilentlyContinue }

$dist = &$Resolve "${projectRoot}/dist"
$types = &$Resolve "${projectRoot}/types" 

if ($null -ne $dist) {
  Remove-Item -Recurse $dist
}

if ($null -ne $types) {
  Remove-Item -Recurse $types
}