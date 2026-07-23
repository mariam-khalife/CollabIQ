import sys
from pathlib import Path

# Make the database package (models, constants) importable for every ai module.
_DATABASE_DIR = Path(__file__).resolve().parent.parent / "database"
if str(_DATABASE_DIR) not in sys.path:
    sys.path.insert(0, str(_DATABASE_DIR))
