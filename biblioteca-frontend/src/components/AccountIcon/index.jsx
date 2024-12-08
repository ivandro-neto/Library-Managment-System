const getInitials = (name) => {
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('').toUpperCase();
    return initials;
};

const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
};

const AccountIcon = ({ name ="", avatarImage ="" }) => {
    const initials = getInitials(name);
    const backgroundColor = stringToColor(name);

    return (
        <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: avatarImage ? 'transparent' : backgroundColor,
        }}>
            {avatarImage ? (
                <img
                    src={avatarImage}
                    alt={`${name}'s avatar`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <span style={{
                    color: 'white',
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                }}>
                    {initials}
                </span>
            )}
        </div>
    );
};

export default AccountIcon;
