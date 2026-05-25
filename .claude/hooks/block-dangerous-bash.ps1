# PreToolUse(Bash) safety guard.
# Claude Code pipes a JSON object on stdin describing the tool call. We read the
# proposed shell command and BLOCK it (exit code 2) if it matches a destructive
# pattern. Exit 2 is special: it stops the tool call and feeds stderr back to Claude.
# Any other exit code (0) lets the command proceed.

$raw = [Console]::In.ReadToEnd()
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$cmd = ""
if ($data.tool_input -and $data.tool_input.command) {
  $cmd = [string]$data.tool_input.command
}
if (-not $cmd) { exit 0 }

# Destructive patterns (case-insensitive regex). Tune this list as you learn.
$patterns = @(
  'rm\s+-rf',
  'rm\s+-fr',
  'rm\s+-r\s+-f',
  'rm\s+-f\s+-r',
  'git\s+push\b.*--force',
  'git\s+push\b.*\s-f(\s|$)',
  'Remove-Item\b.*-Recurse\b.*-Force',
  'Remove-Item\b.*-Force\b.*-Recurse',
  '\bmkfs\b',
  '\bformat\s+[A-Za-z]:',
  '>\s*/dev/sd'
)

foreach ($p in $patterns) {
  if ($cmd -imatch $p) {
    [Console]::Error.WriteLine(
      "BLOCKED by safety hook: command matches forbidden pattern '$p'. " +
      "If this is truly intended, run it yourself outside the agent."
    )
    exit 2
  }
}

exit 0
