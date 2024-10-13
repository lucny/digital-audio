import json
import mido
import time

# Načtení JSON souboru
with open('nastroje.json') as f:
    data = json.load(f)

# Otevření MIDI výstupu
output = mido.open_output()

# Zpracování Program Change pro každý kanál
if 'program_change' in data:
    for program_data in data['program_change']:
        msg_pc = mido.Message('program_change', program=program_data['program'], channel=program_data['channel'])
        output.send(msg_pc)
        print(f'Nastavení programu na kanálu {program_data["channel"]}: {program_data["program"]}')

# Zpracování Control Change (např. hlasitost, modulace) pro každý kanál
if 'control_change' in data:
    for control in data['control_change']:
        msg_cc = mido.Message('control_change', control=control['controller'], value=control['value'], channel=control['channel'])
        output.send(msg_cc)
        print(f'Control Change - Kontrolér {control["controller"]}, hodnota {control["value"]}, kanál {control["channel"]}')

# Zpracování Pitch Bend pro každý kanál
if 'pitch_bend' in data:
    for pitch_bend_data in data['pitch_bend']:
        msg_pb = mido.Message('pitchwheel', pitch=pitch_bend_data['value'], channel=pitch_bend_data['channel'])
        output.send(msg_pb)
        print(f'Pitch Bend - Hodnota {pitch_bend_data["value"]} na kanálu {pitch_bend_data["channel"]}')

# Zpracování Aftertouch pro každý kanál
if 'aftertouch' in data:
    for aftertouch_data in data['aftertouch']:
        msg_at = mido.Message('polytouch', note=aftertouch_data['note'], value=aftertouch_data['value'], channel=aftertouch_data['channel'])
        output.send(msg_at)
        print(f'Aftertouch - Nota {aftertouch_data["note"]}, hodnota {aftertouch_data["value"]}, kanál {aftertouch_data["channel"]}')

# Iterace přes noty a jejich přehrávání
if 'notes' in data:
    for note_data in data['notes']:
        note = note_data['note']
        velocity = note_data['velocity']
        duration = note_data['duration']
        channel = note_data['channel']

        # Odeslání Note On
        msg_on = mido.Message('note_on', note=note, velocity=velocity, channel=channel)
        output.send(msg_on)
        print(f'Přehrávání noty {note} na kanálu {channel}, velocity {velocity}')

        # Trvání noty
        time.sleep(duration)

        # Odeslání Note Off
        msg_off = mido.Message('note_off', note=note, velocity=0, channel=channel)
        output.send(msg_off)
        print(f'Nota {note} na kanálu {channel} byla vypnuta.')

# Zavření MIDI výstupu
output.close()
