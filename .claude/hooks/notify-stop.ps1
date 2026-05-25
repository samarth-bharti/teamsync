# Stop hook: pop a Windows desktop notification when Claude finishes a turn.
# The course uses macOS osascript / Linux notify-send; this is the Windows
# equivalent using a built-in tray balloon (no extra software to install).

try {
  Add-Type -AssemblyName System.Windows.Forms
  Add-Type -AssemblyName System.Drawing
  $n = New-Object System.Windows.Forms.NotifyIcon
  $n.Icon = [System.Drawing.SystemIcons]::Information
  $n.BalloonTipTitle = "Claude Code"
  $n.BalloonTipText = "Finished - your turn."
  $n.Visible = $true
  $n.ShowBalloonTip(4000)
  Start-Sleep -Milliseconds 2000
  $n.Dispose()
} catch { }

exit 0
