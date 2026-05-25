# PostToolUse(Edit|Write) auto-formatter.
# After Claude edits or writes a file, run Prettier on it so the codebase stays
# consistently formatted without anyone thinking about it. We only format files
# Prettier understands, and we never fail the tool call if Prettier errors.

$raw = [Console]::In.ReadToEnd()
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$file = ""
if ($data.tool_input -and $data.tool_input.file_path) {
  $file = [string]$data.tool_input.file_path
}
if (-not $file -or -not (Test-Path $file)) { exit 0 }

$ext = [System.IO.Path]::GetExtension($file).ToLower()
$formattable = @(".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".json", ".css", ".md")
if ($formattable -notcontains $ext) { exit 0 }

# --no-install: never auto-download; use the locally installed Prettier only.
& npx --no-install prettier --write --log-level warn "$file" 2>$null
exit 0
